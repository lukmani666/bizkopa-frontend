import CTASection from "@/components/landing/cta";
import FeaturesSection from "@/components/landing/features";
import HeroSection from "@/components/landing/Hero";
import PricingSection from "@/components/landing/pricesection";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </>
  );
}
