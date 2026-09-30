import { PageShell } from "@/components/interract/page-shell";
import { HeroSection } from "@/components/interract/landing/hero";
import { FeaturedComponents } from "@/components/interract/landing/featured-components";
import { Principles } from "@/components/interract/landing/principles";
import { GetStartedSection } from "@/components/interract/landing/get-started";
import { CtaSection } from "@/components/interract/landing/cta";

export default function Home() {
  return (
    <PageShell>
      <HeroSection />
      <FeaturedComponents />
      <Principles />
      <GetStartedSection />
      <CtaSection />
    </PageShell>
  );
}
