import CTASection from "@/components/landing/cta";
import FeaturesSection from "@/components/landing/features";
import HeroSection from "@/components/landing/Hero";
import PricingSection from "@/components/landing/pricesection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <CTASection />
    </>
  );
}
