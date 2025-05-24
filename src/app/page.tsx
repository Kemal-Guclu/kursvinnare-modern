import { Hero } from "@/components/Hero";
import { ChartSection } from "@/components/ChartSection";
import { AssetList } from "@/components/AssetList";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <Hero />
      <ChartSection />
      <div className="grid gap-8 md:grid-cols-3">
        <AssetList
          title="Svenska Aktier"
          assets={["Volvo", "Investor", "H&M"]}
        />
        <AssetList
          title="Utländska Aktier"
          assets={["Apple", "Tesla", "Amazon"]}
        />
        <AssetList
          title="Kryptovalutor"
          assets={["Bitcoin", "Ethereum", "Solana"]}
        />
      </div>
    </div>
  );
}
