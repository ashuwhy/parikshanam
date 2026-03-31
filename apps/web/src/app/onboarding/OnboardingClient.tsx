"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { ClassLevel } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { captureClient } from "@/lib/analytics/capture";
import { AnalyticsEvents } from "@/lib/analytics/events";

interface Props {
  initialClassLevels: ClassLevel[];
  classLevelsFetchFailed: boolean;
}

export default function OnboardingClient({
  initialClassLevels,
  classLevelsFetchFailed,
}: Props) {
  const router = useRouter();
  const { session, refreshProfile } = useAuth();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [classLevelId, setClassLevelId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const phoneComplete = phone.length === 10;
  const nameValid = name.trim().length > 0;
  const canSubmit = nameValid && !!classLevelId && phoneComplete && !saving;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user || !classLevelId || !phoneComplete || !name.trim()) return;
    setSaving(true);
    setError(null);

    const saveTimeoutMs = 25_000;
    let updateResult: Awaited<
      ReturnType<ReturnType<typeof supabase.from>["update"]>
    >;
    try {
      updateResult = await Promise.race([
        supabase
          .from("profiles")
          .upsert({
            id: session.user.id,
            role: "student",
            full_name: name.trim(),
            phone: phone.trim(),
            class_level_id: classLevelId,
            onboarding_completed: true,
          }),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("SAVE_TIMEOUT")), saveTimeoutMs);
        }),
      ]);
    } catch (err) {
      if (err instanceof Error && err.message === "SAVE_TIMEOUT") {
        setError(
          "Saving timed out. Check your internet connection, confirm NEXT_PUBLIC_SUPABASE_URL in .env.local, then try again.",
        );
      } else {
        setError("Could not save - please try again.");
      }
      setSaving(false);
      return;
    }

    const { error: pgError } = updateResult;
    if (pgError) {
      setError("Could not save - please try again.");
      setSaving(false);
      return;
    }

    captureClient(AnalyticsEvents.onboarding_completed, {
      class_level_id: classLevelId,
    });
    // Do not await: refresh can hang on slow auth/session while the DB write already succeeded.
    void refreshProfile();
    router.push("/dashboard");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(232,114,12,0.09) 0%, transparent 70%)",
      }}
    >
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Image src="/icon.png" width={60} height={60} alt="" className="rounded-2xl mb-4" />
          <h1
            className="text-2xl text-[#1B3A6E] tracking-tight"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
          >
            Let&apos;s set up your profile
          </h1>
          <p
            className="mt-1 text-sm text-[#6B7280] text-center"
            style={{ fontFamily: "var(--font-roboto-var)" }}
          >
            Just a few details to personalize your experience
          </p>
        </div>

        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="bg-white rounded-[2rem] border border-[#E5E0D8] p-8 shadow-sm space-y-5"
        >
          <div>
            <label
              className="block text-xs font-bold uppercase tracking-widest text-[#6B7280] mb-2"
              style={{ fontFamily: "var(--font-nunito-var)" }}
            >
              Your Name *
            </label>
            <div className="flex min-h-[3.25rem] items-stretch rounded-2xl border-2 border-[#E5E0D8] bg-white focus-within:border-[#E8720C] transition-colors overflow-hidden">
              <input
                type="text"
                placeholder="e.g. Aryan Sharma"
                required
                aria-required="true"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-sm text-[#111827] placeholder-[#9CA3AF] shadow-none ring-0 focus:border-0 focus:outline-none focus:ring-0 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0"
                style={{ fontFamily: "var(--font-roboto-var)", caretColor: "#E8720C" }}
              />
            </div>
          </div>

          <div>
            <label
              className="block text-xs font-bold uppercase tracking-widest text-[#6B7280] mb-2"
              style={{ fontFamily: "var(--font-nunito-var)" }}
            >
              Phone *
            </label>
            <div className="flex min-h-[3.25rem] items-stretch rounded-2xl border-2 border-[#E5E0D8] bg-white focus-within:border-[#E8720C] transition-colors overflow-hidden">
              <span
                className="flex items-center px-3 text-sm text-[#9CA3AF] border-r border-[#E5E0D8] bg-white shrink-0"
                style={{ fontFamily: "var(--font-roboto-var)" }}
              >
                +91
              </span>
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="10-digit number"
                required
                aria-required="true"
                minLength={10}
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-sm text-[#111827] placeholder-[#9CA3AF] shadow-none ring-0 focus:border-0 focus:outline-none focus:ring-0 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0"
                style={{ fontFamily: "var(--font-roboto-var)", caretColor: "#E8720C" }}
              />
            </div>
            {phone.length > 0 && !phoneComplete && (
              <p className="mt-1.5 text-xs text-[#6B7280]" style={{ fontFamily: "var(--font-roboto-var)" }}>
                Enter all 10 digits
              </p>
            )}
          </div>

          <div>
            <label
              className="block text-xs font-bold uppercase tracking-widest text-[#6B7280] mb-2"
              style={{ fontFamily: "var(--font-nunito-var)" }}
            >
              Your Class *
            </label>
            <div className="flex flex-wrap gap-2 min-h-[2.75rem] items-center">
              {classLevelsFetchFailed && (
                <div className="flex flex-col gap-2 w-full">
                  <p className="text-sm text-red-600" style={{ fontFamily: "var(--font-roboto-var)" }}>
                    Couldn&apos;t load class list. Check your connection and try again.
                  </p>
                  <Button type="button" variant="outlineAccent" onClick={() => router.refresh()}>
                    Try again
                  </Button>
                </div>
              )}
              {!classLevelsFetchFailed && initialClassLevels.length === 0 && (
                <p className="text-sm text-[#6B7280]" style={{ fontFamily: "var(--font-roboto-var)" }}>
                  No classes available yet.{" "}
                  <button
                    type="button"
                    className="text-[#E8720C] underline font-medium"
                    onClick={() => router.refresh()}
                  >
                    Refresh
                  </button>
                </p>
              )}
              {!classLevelsFetchFailed &&
                initialClassLevels.map((cl) => (
                  <Button
                    key={cl.id}
                    type="button"
                    variant={classLevelId === cl.id ? "choiceOn" : "choiceOff"}
                    onClick={() => setClassLevelId(cl.id)}
                  >
                    {cl.label}
                  </Button>
                ))}
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600" style={{ fontFamily: "var(--font-roboto-var)" }}>
              {error}
            </p>
          )}

          <Button type="submit" variant="primary" disabled={!canSubmit}>
            {saving ? "Saving…" : "Start Learning →"}
          </Button>
        </form>
      </div>
    </div>
  );
}
