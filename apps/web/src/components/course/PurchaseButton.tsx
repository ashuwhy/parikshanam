"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { Course } from "@/lib/types";
import { formatPrice } from "@/lib/courseUtils";
import { createClient } from "@/lib/supabase/client";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

interface Props {
  course: Course;
  purchased: boolean;
  modules: { id: string; lessons: { id: string }[]; quizzes: { id: string }[] }[];
  completedIds: Set<string | null | undefined>;
}

export function PurchaseButton({ course, purchased, modules, completedIds }: Props) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [buying, setBuying] = useState(false);

  const handleContinue = () => {
    // Find first incomplete lesson or quiz
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
    // All done — go to first lesson
    const first = modules[0]?.lessons[0];
    if (first) router.push(`/course/${course.id}/lesson/${first.id}`);
    else toast.info("No content available yet.");
  };

  const handleBuy = async () => {
    setBuying(true);
    try {
      const { data, error } = await supabase.functions.invoke<{
        order_id: string;
        amount: number;
        currency: string;
      }>("create-razorpay-order", { body: { course_id: course.id } });

      if (error || !data) {
        toast.error("Could not create order. Please try again.");
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        order_id: data.order_id,
        amount: data.amount,
        currency: data.currency,
        name: "Parikshanam",
        description: course.title,
        prefill: {
          email: user?.email,
        },
        theme: { color: "#E8720C" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const { error: pgErr } = await supabase.from("purchases").upsert({
            user_id: user?.id,
            course_id: course.id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amount: data.amount,
            status: "completed",
          });
          if (pgErr) {
            toast.error("Payment recorded but enrollment failed. Contact support.");
          } else {
            toast.success("Enrolled! Let's start learning.");
            router.refresh();
          }
        },
      });
      rzp.open();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setBuying(false);
    }
  };

  if (purchased) {
    return (
      <button
        onClick={handleContinue}
        className="w-full py-4 rounded-2xl bg-[#E8720C] text-white text-base border-b-4 border-[#A04F08] active:translate-y-[2px] active:border-b-2 transition-all shadow-lg"
        style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
      >
        Continue Learning →
      </button>
    );
  }

  return (
    <>
      {/* Load Razorpay checkout.js */}
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" />
      <button
        onClick={() => void handleBuy()}
        disabled={buying}
        className="w-full py-4 rounded-2xl bg-[#E8720C] text-white text-base border-b-4 border-[#A04F08] active:translate-y-[2px] active:border-b-2 transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
      >
        {buying ? "Processing…" : `Buy Course — ${formatPrice(course.price)}`}
      </button>
    </>
  );
}
