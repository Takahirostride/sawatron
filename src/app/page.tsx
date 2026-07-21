import {
  AboutSection,
  CharacterSection,
  ContactSection,
  Footer,
  HeroSection,
  SkillsSection,
  WorksSection,
} from "@/components/sections";
import { getPortfolioContent } from "@/lib/portfolio";
import { getWorkDetails } from "@/lib/work-details";

export default async function Home() {
  const [portfolio, workDetails] = await Promise.all([
    getPortfolioContent(),
    getWorkDetails(),
  ]);

  return (
    <main>
      <HeroSection />
      <AboutSection content={portfolio.about} />
      <SkillsSection content={portfolio.skills} />
      <WorksSection works={workDetails} />
      <CharacterSection content={portfolio.experience} />
      <ContactSection />
      <Footer />
    </main>
  );
}
