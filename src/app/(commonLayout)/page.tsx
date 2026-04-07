import { FeaturedGrid } from "./_components/FeaturedGrid";
import { CategoryBar } from "./_components/CategoryBar";
import { StatsSection } from "./_components/StatsSection";
import { HeroSection } from "./_components/HeroSection";
import { TrendingSection } from "./_components/TrendingSection";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <CategoryBar />
      <FeaturedGrid />
      <StatsSection />
      <TrendingSection />
    </div>
  );
}

