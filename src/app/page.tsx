import { Hero } from "@/components/Hero";
import { ChartSection } from "@/components/ChartSection";
import AssetList from "@/components/AssetList";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <Hero />
      <ChartSection />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <AssetList title="Svenska Aktier" type="stock-se" />
        <AssetList title="Utländska Aktier" type="stock-us" />
        <AssetList title="Kryptovalutor" type="crypto" />
      </div>
    </div>
  );
}
