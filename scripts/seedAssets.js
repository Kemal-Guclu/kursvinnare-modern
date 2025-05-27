const fetch = require("node-fetch");
// installera med: npm i node-fetch@2

const ASSETS = {
  crypto: [
    { name: "Bitcoin", symbol: "BTC" },
    { name: "Ethereum", symbol: "ETH" },
    { name: "Solana", symbol: "SOL" },
    { name: "Ripple", symbol: "XRP" },
    { name: "Cardano", symbol: "ADA" },
    { name: "Dogecoin", symbol: "DOGE" },
    { name: "Polygon", symbol: "MATIC" },
    { name: "Avalanche", symbol: "AVAX" },
    { name: "Polkadot", symbol: "DOT" },
    { name: "Binance Coin", symbol: "BNB" },
  ],
  "stock-se": [
    { name: "Ericsson", symbol: "ERIC-B", country: "se" },
    { name: "H&M", symbol: "HM-B", country: "se" },
    { name: "Volvo", symbol: "VOLV-B", country: "se" },
    { name: "Atlas Copco", symbol: "ATCO-A", country: "se" },
    { name: "Sandvik", symbol: "SAND", country: "se" },
    { name: "SKF", symbol: "SKF-B", country: "se" },
    { name: "Telia Company", symbol: "TELIA", country: "se" },
    { name: "Securitas", symbol: "SECU-B", country: "se" },
    { name: "Essity", symbol: "ESSITY-B", country: "se" },
    { name: "Electrolux", symbol: "ELUX-B", country: "se" },
  ],
  "stock-us": [
    { name: "Apple Inc.", symbol: "AAPL", country: "us" },
    { name: "Microsoft", symbol: "MSFT", country: "us" },
    { name: "Amazon", symbol: "AMZN", country: "us" },
    { name: "Tesla", symbol: "TSLA", country: "us" },
    { name: "Alphabet", symbol: "GOOGL", country: "us" },
    { name: "Meta Platforms", symbol: "META", country: "us" },
    { name: "NVIDIA", symbol: "NVDA", country: "us" },
    { name: "JPMorgan Chase", symbol: "JPM", country: "us" },
    { name: "Johnson & Johnson", symbol: "JNJ", country: "us" },
    { name: "Visa", symbol: "V", country: "us" },
  ],
};

const API_URL = "http://localhost:3000/api/assets";

async function seed() {
  for (const [type, assets] of Object.entries(ASSETS)) {
    for (const asset of assets) {
      const body = {
        name: asset.name,
        symbol: asset.symbol,
        type,
        country: asset.country || null,
      };

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (res.ok) {
          const data = await res.json();
          console.log(`Added asset: ${data.name} (${data.symbol})`);
        } else {
          const err = await res.json();
          console.error(`Failed to add ${asset.symbol}:`, err);
        }
      } catch (error) {
        console.error(`Error adding ${asset.symbol}:`, error);
      }
    }
  }

  console.log("Seed script completed.");
}

seed();
