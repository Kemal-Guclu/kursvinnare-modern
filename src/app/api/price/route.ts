// src/app/api/price/route.ts
import { NextRequest, NextResponse } from "next/server";

// CoinGecko ID-mappning
const COINGECKO_IDS: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  XRP: "ripple",
  ADA: "cardano",
  DOGE: "dogecoin",
  MATIC: "matic-network",
  AVAX: "avalanche-2",
  DOT: "polkadot",
  BNB: "binancecoin",
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");
  const type = searchParams.get("type");

  if (!symbol || !type) {
    return NextResponse.json(
      { error: "symbol och type krävs" },
      { status: 400 }
    );
  }

  try {
    if (type === "crypto") {
      const coinId = COINGECKO_IDS[symbol.toUpperCase()];
      if (!coinId) {
        return NextResponse.json(
          { error: "Okänd kryptovaluta" },
          { status: 400 }
        );
      }

      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=sek&include_24hr_change=true`;
      const res = await fetch(url);
      const data = await res.json();

      return NextResponse.json({
        price: data[coinId]?.sek ?? null,
        change24h: data[coinId]?.sek_24h_change ?? null,
      });
    }

    if (type === "stock") {
      const token = process.env.EODHD_API_KEY;
      if (!token) throw new Error("EODHD_API_KEY saknas");

      const url = `https://eodhd.com/api/real-time/${symbol}?api_token=${token}&fmt=json`;
      const res = await fetch(url);
      const data = await res.json();

      return NextResponse.json({
        price: data.close ?? null,
        change24h: data.change_p ?? null,
      });
    }

    return NextResponse.json({ error: "Ogiltig typ" }, { status: 400 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Fel vid hämtning av data:", error.message);
    } else {
      console.error("Fel vid hämtning av data:", error);
    }
    return NextResponse.json(
      { error: "Fel vid hämtning av data" },
      { status: 500 }
    );
  }
}
