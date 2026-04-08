import { FeaturedGrid } from "./_components/FeaturedGrid";
import { CategoryBar } from "./_components/CategoryBar";
import { StatsSection } from "./_components/StatsSection";
import { HeroSection } from "./_components/HeroSection";
import { TrendingSection } from "./_components/TrendingSection";
import { TestimonialsSection } from "./_components/TestimonialsSection";
import { BlogPreviewSection } from "./_components/BlogPreviewSection";
import { NewsletterSection } from "./_components/NewsletterSection";
import { FAQSection } from "./_components/FAQSection";
import { FinalCTASection } from "./_components/FinalCTASection";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <HeroSection />
      <CategoryBar />
      <FeaturedGrid />
      <TestimonialsSection />
      <StatsSection />
      <BlogPreviewSection />
      <TrendingSection />
      <FAQSection />
      <NewsletterSection />
      <FinalCTASection />
    </div>
  );
}

