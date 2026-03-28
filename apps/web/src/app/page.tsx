import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import SubjectsSection from "@/components/SubjectsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CourseShowcaseSection from "@/components/CourseShowcaseSection";
import AppDownloadSection from "@/components/AppDownloadSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col">
        <HeroSection />
        <FeaturesSection />
        <SubjectsSection />
        <HowItWorksSection />
        <CourseShowcaseSection />
        <AppDownloadSection />
      </main>
      <Footer />
    </>
  );
}
