"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { ClassLevel } from "@/lib/types";
import { Button } from "@/components/ui/Button";

export default function OnboardingPage() {
  const router = useRouter();
  const { session, refreshProfile } = useAuth();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [classLevelId, setClassLevelId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    data: classLevels = [],
    isPending: classLevelsLoading,
    isError: classLevelsError,
    refetch: refetchClassLevels,
  } = useQuery<ClassLevel[]>({
    queryKey: ["class_levels"],
    queryFn: async () => {
      const { data, error: qError } = await supabase
        .from("class_levels")
        .select("*")
        .order("min_age", { ascending: true });
      if (qError) throw qError;
      return (data as ClassLevel[]) ?? [];
    },
    staleTime: 60 * 60_000,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 4000),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user || !classLevelId) return;
    setSaving(true);
    setError(null);

    const { error: pgError } = await supabase
      .from("profiles")
      .update({
        full_name: name.trim() || null,
        phone: phone.trim() || null,
        class_level_id: classLevelId,
        onboarding_completed: true,
      })
      .eq("id", session.user.id);

    if (pgError) {
      setError("Could not save — please try again.");
      setSaving(false);
      return;
    }

    await refreshProfile();
    router.push("/dashboard");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(232,114,12,0.09) 0%, transparent 70%), #F9F7F5",
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
          {/* Name */}
          <div>
            <label
              className="block text-xs font-bold uppercase tracking-widest text-[#6B7280] mb-2"
              style={{ fontFamily: "var(--font-nunito-var)" }}
            >
              Your Name
            </label>
            <input
              type="text"
              placeholder="e.g. Aryan Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border-2 border-[#E5E0D8] px-4 py-3 text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#E8720C] transition-colors"
              style={{ fontFamily: "var(--font-roboto-var)" }}
            />
          </div>

          {/* Phone */}
          <div>
            <label
              className="block text-xs font-bold uppercase tracking-widest text-[#6B7280] mb-2"
              style={{ fontFamily: "var(--font-nunito-var)" }}
            >
              Phone (optional)
            </label>
            <div className="flex items-center rounded-xl border-2 border-[#E5E0D8] focus-within:border-[#E8720C] transition-colors overflow-hidden">
              <span
                className="px-3 py-3 text-sm text-[#9CA3AF] border-r border-[#E5E0D8]"
                style={{ fontFamily: "var(--font-roboto-var)" }}
              >
                +91
              </span>
              <input
                type="tel"
                placeholder="10-digit number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="flex-1 px-4 py-3 text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none bg-transparent"
                style={{ fontFamily: "var(--font-roboto-var)" }}
              />
            </div>
          </div>

          {/* Class level */}
          <div>
            <label
              className="block text-xs font-bold uppercase tracking-widest text-[#6B7280] mb-2"
              style={{ fontFamily: "var(--font-nunito-var)" }}
            >
              Your Class *
            </label>
            <div className="flex flex-wrap gap-2 min-h-[2.75rem] items-center">
              {classLevelsLoading && (
                <p className="text-sm text-[#6B7280]" style={{ fontFamily: "var(--font-roboto-var)" }}>
                  Loading classes…
                </p>
              )}
              {classLevelsError && (
                <div className="flex flex-col gap-2 w-full">
                  <p className="text-sm text-red-600" style={{ fontFamily: "var(--font-roboto-var)" }}>
                    Couldn&apos;t load class list. Check your connection and try again.
                  </p>
                  <Button type="button" variant="outlineAccent" onClick={() => void refetchClassLevels()}>
                    Retry
                  </Button>
                </div>
              )}
              {!classLevelsLoading &&
                !classLevelsError &&
                classLevels.length === 0 && (
                  <p className="text-sm text-[#6B7280]" style={{ fontFamily: "var(--font-roboto-var)" }}>
                    No classes available.{" "}
                    <button
                      type="button"
                      className="text-[#E8720C] underline font-medium"
                      onClick={() => void refetchClassLevels()}
                    >
                      Refresh
                    </button>
                  </p>
                )}
              {!classLevelsLoading &&
                !classLevelsError &&
                classLevels.map((cl) => (
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

          <Button type="submit" variant="primary" disabled={saving || !classLevelId}>
            {saving ? "Saving…" : "Start Learning →"}
          </Button>
        </form>
      </div>
    </div>
  );
}
