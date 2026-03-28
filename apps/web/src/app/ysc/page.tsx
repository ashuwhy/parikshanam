import type { Metadata } from "next";

import Navbar from "@/components/Navbar";
import { loadAllYscStudents } from "@/lib/ysc/students";

import YscClient from "./YscClient";

export const metadata: Metadata = {
  title: "YSC certificate download - Parikshanam",
  description:
    "Download your Young Scientist Challenge participation or merit certificate (APS Kolkata).",
};

export default function YscPage() {
  const students = loadAllYscStudents();

  return (
    <>
      <Navbar />
      <YscClient students={students} />
    </>
  );
}
