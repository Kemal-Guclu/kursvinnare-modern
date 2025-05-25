// app/page.tsx
import { Hero } from "@/components/Hero";
import { ChartSection } from "@/components/ChartSection";
import AssetList from "@/components/AssetList";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <Hero />
      <ChartSection />
      <div className="grid gap-8 md:grid-cols-3">
        <AssetList
          title="Svenska Aktier"
          assets={[
            { symbol: "VOLV-B.ST", name: "Volvo", type: "stock" },
            { symbol: "INVE-B.ST", name: "Investor", type: "stock" },
            { symbol: "HM-B.ST", name: "H&M", type: "stock" },
          ]}
        />
        <AssetList
          title="Utländska Aktier"
          assets={[
            { symbol: "AAPL", name: "Apple", type: "stock" },
            { symbol: "TSLA", name: "Tesla", type: "stock" },
            { symbol: "AMZN", name: "Amazon", type: "stock" },
          ]}
        />
        <AssetList
          title="Kryptovalutor"
          assets={[
            { symbol: "BTC", name: "Bitcoin", type: "crypto" },
            { symbol: "ETH", name: "Ethereum", type: "crypto" },
            { symbol: "SOL", name: "Solana", type: "crypto" },
          ]}
        />
      </div>
    </div>
  );
}
