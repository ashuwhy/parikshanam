"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Calendar,
  Compass,
  GraduationCap,
  Hash,
  ListChecks,
  LogOut,
  Phone,
  Shield,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { ClassLevel } from "@/lib/types";
import { Button } from "@/components/ui/Button";

function formatMemberSince(iso: string | undefined) {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "-";
  }
}

export default function ProfilePage() {
  const { session, profile, signOut, refreshProfile } = useAuth();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const email = session?.user?.email ?? null;
  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : email?.[0]?.toUpperCase() ?? "?";

  const { data: classLevels = [] } = useQuery<ClassLevel[]>({
    queryKey: ["class_levels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("class_levels")
        .select("*")
        .order("min_age", { ascending: true });
      if (error) throw error;
      return (data as ClassLevel[]) ?? [];
    },
    staleTime: 60 * 60_000,
  });

  const classLabel =
    profile?.class_level_id != null
      ? classLevels.find((c) => c.id === profile.class_level_id)?.label ?? profile.class_level_id
      : null;

  const { data: profileStats } = useQuery({
    queryKey: ["profile-stats", session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      const uid = session!.user!.id;
      const [purchasesRes, progressRes] = await Promise.all([
        supabase
          .from("purchases")
          .select("id", { count: "exact", head: true })
          .eq("user_id", uid)
          .eq("status", "completed"),
        supabase
          .from("user_progress")
          .select("id", { count: "exact", head: true })
          .eq("user_id", uid)
          .not("lesson_id", "is", null),
      ]);
      return {
        enrolled: purchasesRes.count ?? 0,
        lessonsDone: progressRes.count ?? 0,
      };
    },
    staleTime: 60_000,
  });

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

  const handleSignOut = () => {
    void signOut("/login");
  };

  const roleLabel = profile?.role
    ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
    : "Student";

  return (
    <div className="min-h-screen bg-transparent">
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
              <Button
                variant="ghostPill"
                onClick={() => {
                  setName(profile?.full_name ?? "");
                  setEditing(true);
                }}
                className="mt-3"
              >
                Edit profile
              </Button>
            </div>
          ) : (
            <div className="mt-4 w-full">
              <label
                className="block text-[10px] uppercase tracking-wider text-[#9CA3AF] mb-1.5"
                style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}
              >
                Full Name
              </label>
              <div className="flex min-h-[3.25rem] w-full items-stretch rounded-2xl border-2 border-[#E5E0D8] bg-white focus-within:border-[#E8720C] transition-colors overflow-hidden">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoFocus
                  className="min-w-0 w-full flex-1 border-0 bg-transparent px-4 py-3 text-sm text-[#111827] placeholder-[#9CA3AF] shadow-none outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0"
                  style={{ fontFamily: "var(--font-roboto-var)", caretColor: "#E8720C" }}
                />
              </div>
              <div className="flex gap-3 mt-3">
                <Button
                  variant="primaryCompact"
                  onClick={() => void handleSave()}
                  disabled={saving}
                  className="disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save"}
                </Button>
                <Button
                  variant="secondaryCompact"
                  onClick={() => {
                    setEditing(false);
                    setName(profile?.full_name ?? "");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Learning snapshot */}
        {profileStats && (
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="rounded-2xl bg-white border border-[#E5E0D8] px-4 py-3 text-center">
              <p
                className="text-2xl text-[#E8720C]"
                style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
              >
                {profileStats.enrolled}
              </p>
              <p
                className="text-[10px] text-[#9CA3AF] uppercase tracking-wider mt-0.5"
                style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}
              >
                Courses
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-[#E5E0D8] px-4 py-3 text-center">
              <p
                className="text-2xl text-[#1B3A6E]"
                style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
              >
                {profileStats.lessonsDone}
              </p>
              <p
                className="text-[10px] text-[#9CA3AF] uppercase tracking-wider mt-0.5"
                style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}
              >
                Lessons done
              </p>
            </div>
          </div>
        )}

        {/* Quick links */}
        <div className="flex flex-col gap-2 mb-5">
          <Link
            href="/my-courses"
            className="flex items-center gap-3 rounded-2xl border border-[#E5E0D8] bg-white px-4 py-3 text-sm text-[#111827] hover:border-[#E8720C]/40 transition-colors"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}
          >
            <BookOpen size={18} color="#E8720C" strokeWidth={2.2} />
            My courses
          </Link>
          <Link
            href="/explore"
            className="flex items-center gap-3 rounded-2xl border border-[#E5E0D8] bg-white px-4 py-3 text-sm text-[#111827] hover:border-[#E8720C]/40 transition-colors"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}
          >
            <Compass size={18} color="#1B3A6E" strokeWidth={2.2} />
            Explore catalog
          </Link>
        </div>

        {/* Account details */}
        <div className="rounded-2xl bg-white border border-[#E5E0D8] divide-y divide-[#F3F4F6] mb-5">
          <div className="flex items-center gap-3 px-5 py-4">
            <User size={16} color="#9CA3AF" strokeWidth={2} />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}>
                Email
              </p>
              <p className="text-sm text-[#111827] break-all" style={{ fontFamily: "var(--font-roboto-var)" }}>
                {email ?? "-"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-5 py-4">
            <Phone size={16} color="#9CA3AF" strokeWidth={2} />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}>
                Phone
              </p>
              <p className="text-sm text-[#111827]" style={{ fontFamily: "var(--font-roboto-var)" }}>
                {profile?.phone?.trim() ? profile.phone : "Not added"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-5 py-4">
            <GraduationCap size={16} color="#9CA3AF" strokeWidth={2} />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}>
                Class
              </p>
              <p className="text-sm text-[#111827]" style={{ fontFamily: "var(--font-roboto-var)" }}>
                {classLabel ?? "Not set"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-5 py-4">
            <Shield size={16} color="#9CA3AF" strokeWidth={2} />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}>
                Account type
              </p>
              <p className="text-sm text-[#111827]" style={{ fontFamily: "var(--font-roboto-var)" }}>
                {roleLabel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-5 py-4">
            <Calendar size={16} color="#9CA3AF" strokeWidth={2} />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}>
                Member since
              </p>
              <p className="text-sm text-[#111827]" style={{ fontFamily: "var(--font-roboto-var)" }}>
                {formatMemberSince(profile?.created_at)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-5 py-4">
            <ListChecks size={16} color="#9CA3AF" strokeWidth={2} />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}>
                Onboarding
              </p>
              <p className="text-sm text-[#111827]" style={{ fontFamily: "var(--font-roboto-var)" }}>
                {profile?.onboarding_completed ? "Completed" : "Not completed"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-5 py-4">
            <Hash size={16} color="#9CA3AF" strokeWidth={2} />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}>
                User ID
              </p>
              <p className="text-xs text-[#6B7280] font-mono break-all" title={session?.user?.id}>
                {session?.user?.id ?? "-"}
              </p>
            </div>
          </div>
        </div>

        <Button variant="danger" type="button" onClick={handleSignOut}>
          <LogOut size={16} strokeWidth={2} />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
