import {
  AboutSection,
  CharacterSection,
  ContactSection,
  Footer,
  HeroSection,
  SkillsSection,
  WorksSection,
} from "@/components/sections";
import { getWorkDetails } from "@/lib/work-details";
import { getPortfolioPosts } from "@/lib/wordpress";

export default async function Home() {
  const [posts, workDetails] = await Promise.all([
    getPortfolioPosts(),
    getWorkDetails(),
  ]);

  return (
    <main>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <WorksSection posts={posts} details={workDetails} />
      <CharacterSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
