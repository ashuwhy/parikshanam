"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import type { ClassLevel } from "@/lib/types";

export default function OnboardingPage() {
  const router = useRouter();
  const { session, refreshProfile } = useAuth();
  const supabase = useMemo(() => createClient(), []);

  const [classLevels, setClassLevels] = useState<ClassLevel[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [classLevelId, setClassLevelId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("class_levels")
      .select("*")
      .order("id")
      .then(({ data }) => {
        if (data) setClassLevels(data as ClassLevel[]);
      });
  }, [supabase]);

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
            <div className="flex flex-wrap gap-2">
              {classLevels.map((cl) => (
                <button
                  key={cl.id}
                  type="button"
                  onClick={() => setClassLevelId(cl.id)}
                  className={`px-4 py-2 rounded-xl border-2 text-sm transition-all ${
                    classLevelId === cl.id
                      ? "bg-[#E8720C] border-[#A04F08] text-white"
                      : "bg-white border-[#E5E0D8] text-[#374151] hover:border-[#E8720C]"
                  }`}
                  style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
                >
                  {cl.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600" style={{ fontFamily: "var(--font-roboto-var)" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving || !classLevelId}
            className="w-full py-4 rounded-2xl bg-[#E8720C] text-white text-base border-b-4 border-[#A04F08] active:translate-y-[2px] active:border-b-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
          >
            {saving ? "Saving…" : "Start Learning →"}
          </button>
        </form>
      </div>
    </div>
  );
}
