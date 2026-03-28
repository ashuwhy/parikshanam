"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const router = useRouter();
  const { session, profile, signOut, refreshProfile } = useAuth();
  const supabase = useMemo(() => createClient(), []);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(profile?.full_name ?? "");
  }, [profile?.full_name]);

  const email = session?.user?.email ?? null;
  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : email?.[0]?.toUpperCase() ?? "?";

  const handleSave = async () => {
    if (!session?.user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: name.trim() || null })
      .eq("id", session.user.id);
    setSaving(false);
    if (error) {
      toast.error("Failed to update profile");
    } else {
      await refreshProfile();
      setEditing(false);
      toast.success("Profile updated");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-[#F9F7F5]">
      <div className="max-w-lg mx-auto px-5 py-8">
        <h1
          className="text-2xl text-[#111827] mb-8"
          style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
        >
          Profile
        </h1>

        {/* Avatar + name */}
        <div className="flex flex-col items-center mb-8">
          {profile?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt=""
              className="w-20 h-20 rounded-full object-cover border-2 border-[#E5E0D8]"
            />
          ) : (
            <div
              className="w-20 h-20 rounded-full bg-[#1B3A6E] flex items-center justify-center text-2xl text-white"
              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
            >
              {initials}
            </div>
          )}

          {!editing ? (
            <div className="mt-4 text-center">
              <p
                className="text-xl text-[#111827]"
                style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
              >
                {profile?.full_name?.trim() || "Add your name"}
              </p>
              {email && (
                <p className="mt-1 text-sm text-[#9CA3AF]" style={{ fontFamily: "var(--font-roboto-var)" }}>
                  {email}
                </p>
              )}
              <button
                onClick={() => setEditing(true)}
                className="mt-3 rounded-full border border-[#E5E0D8] px-5 py-1.5 text-xs uppercase tracking-wider text-[#6B7280] hover:border-[#E8720C] hover:text-[#E8720C] transition-colors"
                style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
              >
                Edit profile
              </button>
            </div>
          ) : (
            <div className="mt-4 w-full">
              <label
                className="block text-[10px] uppercase tracking-wider text-[#9CA3AF] mb-1.5"
                style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}
              >
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoFocus
                className="w-full rounded-2xl border-2 border-[#E5E0D8] bg-white px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#E8720C] transition-colors"
                style={{ fontFamily: "var(--font-roboto-var)" }}
              />
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => void handleSave()}
                  disabled={saving}
                  className="flex-1 py-3 rounded-2xl bg-[#E8720C] text-white text-sm border-b-4 border-[#A04F08] active:translate-y-[2px] transition-all disabled:opacity-60"
                  style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
                >
                  {saving ? "Saving…" : "Save"}
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setName(profile?.full_name ?? "");
                  }}
                  className="flex-1 py-3 rounded-2xl border-2 border-[#E5E0D8] bg-white text-sm text-[#374151] hover:border-[#E8720C] transition-colors"
                  style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Account info */}
        <div className="rounded-2xl bg-white border border-[#E5E0D8] divide-y divide-[#F3F4F6] mb-5">
          <div className="flex items-center gap-3 px-5 py-4">
            <User size={16} color="#9CA3AF" strokeWidth={2} />
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}>
                Email
              </p>
              <p className="text-sm text-[#111827]" style={{ fontFamily: "var(--font-roboto-var)" }}>
                {email ?? "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={() => void handleSignOut()}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-red-200 bg-red-50 text-red-600 text-sm hover:bg-red-100 transition-colors"
          style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
        >
          <LogOut size={16} strokeWidth={2} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
