import type { Metadata } from "next";

import YscClient from "@/components/ysc/YscClient";
import { loadAllYscStudents } from "@/lib/ysc/students";

export const metadata: Metadata = {
  title: "YSC certificate download - Parikshanam",
  description:
    "Download your Young Scientist Challenge participation or merit certificate (APS Kolkata). Sign in required.",
};

export default function YscPage() {
  const students = loadAllYscStudents();

  return <YscClient students={students} />;
}
