"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import type { Course } from "@/lib/types";
import { formatPrice } from "@/lib/courseUtils";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

const UPI_ID = "manasputra.paiko@okhdfcbank";

interface Props {
  course: Course;
  purchased: boolean;
  modules: { id: string; lessons: { id: string }[]; quizzes: { id: string }[] }[];
  completedIds: Set<string | null | undefined>;
}

export function PurchaseButton({ course, purchased, modules, completedIds }: Props) {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  // UPI state
  const [upiFile, setUpiFile] = useState<File | null>(null);
  const [upiPreview, setUpiPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleContinue = () => {
    for (const mod of modules) {
      for (const lesson of mod.lessons) {
        if (!completedIds.has(lesson.id)) {
          router.push(`/course/${course.id}/lesson/${lesson.id}`);
          return;
        }
      }
      for (const quiz of mod.quizzes) {
        if (!completedIds.has(quiz.id)) {
          router.push(`/course/${course.id}/quiz/${quiz.id}`);
          return;
        }
      }
    }
    const first = modules[0]?.lessons[0];
    if (first) router.push(`/course/${course.id}/lesson/${first.id}`);
    else toast.info("No content available yet.");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUpiFile(file);
    const url = URL.createObjectURL(file);
    setUpiPreview(url);
  };

  const handleUpiSubmit = async () => {
    if (!upiFile) return;
    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Upload screenshot directly to Supabase Storage
      const ext = upiFile.name.split(".").pop() ?? "jpg";
      const storagePath = `${user.id}/${Date.now()}.${ext}`;
      
      console.log("Uploading to Supabase Storage...");
      const { error: uploadErr } = await supabase.storage
        .from("payment-proofs")
        .upload(storagePath, upiFile, { contentType: upiFile.type });
      if (uploadErr) throw uploadErr;
      console.log("Upload complete.");

      // Notify server → send email + insert pending purchase
      console.log("Calling API route...");
      const res = await fetch("/api/submit-payment-proof", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_id: course.id,
          amount: course.price,
          storage_path: storagePath,
        }),
      });
      console.log("API response status:", res.status);
      if (!res.ok) throw new Error("Submission failed");

      toast.success("Payment submitted! You'll be enrolled within 24 hours.");
      setUpiFile(null);
      setUpiPreview(null);
      router.refresh();
    } catch {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (purchased) {
    return (
      <Button variant="primaryShadow" onClick={handleContinue}>
        Continue Learning →
      </Button>
    );
  }

  // UPI payment panel
  return (
    <div className="rounded-[var(--radius-card)] border-2 border-[#E5E0D8] bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b border-[#E5E0D8]">
        <span
          className="text-sm text-[#111827]"
          style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
        >
          Pay via UPI / QR Code
        </span>
      </div>

      <div className="px-4 py-4 flex flex-col gap-4">
        {/* QR + UPI ID */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-44 h-44 rounded-xl overflow-hidden border border-[#E5E0D8] flex items-center justify-center bg-[#F9F7F5]">
            <Image
              src="/upi-qr.png"
              alt="UPI QR Code"
              width={176}
              height={176}
              className="object-contain"
              onError={(e) => {
                // Hide if QR not yet added
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>

          <div className="text-center">
            <p
              className="text-[10px] uppercase tracking-wider text-[#9CA3AF] mb-0.5"
              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}
            >
              UPI ID
            </p>
            <Button
              variant="linkUPI"
              onClick={() => {
                void navigator.clipboard.writeText(UPI_ID);
                toast.success("UPI ID copied!");
              }}
            >
              {UPI_ID}
            </Button>
          </div>

          <div
            className="px-4 py-2 rounded-xl bg-[#E8720C]/10 text-[#E8720C] text-sm"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
          >
            Pay exactly {formatPrice(course.price)}
          </div>
        </div>

        {/* Screenshot upload */}
        <div>
          <p
            className="text-xs text-[#374151] mb-2"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
          >
            After paying, upload your payment screenshot:
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          {upiPreview ? (
            <div className="relative rounded-xl overflow-hidden border border-[#E5E0D8]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={upiPreview} alt="screenshot" className="w-full max-h-48 object-contain bg-[#F9F7F5]" />
              <Button
                variant="removeOverlay"
                onClick={() => { setUpiFile(null); setUpiPreview(null); }}
                aria-label="Remove screenshot"
              >
                <X size={14} strokeWidth={2.5} color="#374151" />
              </Button>
            </div>
          ) : (
            <Button variant="uploadDashed" onClick={() => fileInputRef.current?.click()}>
              <Upload size={22} color="#9CA3AF" strokeWidth={2} />
              <span className="text-xs text-[#9CA3AF]" style={{ fontFamily: "var(--font-roboto-var)" }}>
                Tap to upload screenshot
              </span>
            </Button>
          )}
        </div>

        {/* Submit */}
        <Button
          variant="primary"
          onClick={() => void handleUpiSubmit()}
          disabled={!upiFile || submitting}
        >
          {submitting ? "Submitting…" : "Submit for Verification"}
        </Button>

        <p className="text-center text-xs text-[#9CA3AF]" style={{ fontFamily: "var(--font-roboto-var)" }}>
          You&apos;ll be enrolled within 24 hours of verification.
        </p>
      </div>
    </div>
  );
}
