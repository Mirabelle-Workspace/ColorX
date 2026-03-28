import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { WCAGExplainer } from "@/components/landing/WCAGExplainer";
import { TokenReference } from "@/components/landing/TokenReference";
import { CTABottom } from "@/components/landing/CTABottom";

export function LandingPage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
      <WCAGExplainer />
      <TokenReference />
      <CTABottom />
    </>
  );
}
