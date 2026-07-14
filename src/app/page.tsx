import {
  AboutSection,
  CharacterSection,
  ContactSection,
  Footer,
  HeroSection,
  SkillsSection,
  WorksSection,
} from "@/components/sections";
import { getPortfolioPosts } from "@/lib/wordpress";

export default async function Home() {
  const posts = await getPortfolioPosts();

  return (
    <main>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <WorksSection posts={posts} />
      <CharacterSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
