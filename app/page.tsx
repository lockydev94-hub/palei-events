import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { EventTypes } from "@/components/home/EventTypes";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ExperienceSection } from "@/components/home/ExperienceSection";
import { FeaturesPreview } from "@/components/home/FeaturesPreview";
import { FullWidthMessage } from "@/components/home/FullWidthMessage";
import { TemplatesPreview } from "@/components/home/TemplatesPreview";
import { MemoriesSection } from "@/components/home/MemoriesSection";
import { SolutionsPreview } from "@/components/home/SolutionsPreview";
import { FinalCTA } from "@/components/home/FinalCTA";

export const metadata: Metadata = {
  title: "Palei Events — Every Event. One Digital Experience.",
  description:
    "Create beautiful digital event experiences for weddings, birthdays, corporate events, schools, colleges and celebrations with Palei Events.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <EventTypes />
      <HowItWorks />
      <ExperienceSection />
      <FeaturesPreview />
      <FullWidthMessage />
      <TemplatesPreview />
      <MemoriesSection />
      <SolutionsPreview />
      <FinalCTA />
    </>
  );
}