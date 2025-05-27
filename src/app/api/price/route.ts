// src/app/api/price/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

// Enkel in-memory rate limiter per IP (max 5 requests per 60 sekunder)
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 5;
const ipRequests: Map<string, number[]> = new Map();

function getClientIp(req: NextRequest): string {
  const xForwardedFor = req.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    // Om flera IP:er är listade, ta första (klientens riktiga IP)
    return xForwardedFor.split(",")[0].trim();
  }
  // Ingen proxy-header, returnera "unknown"
  return "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const timestamps = ipRequests.get(ip) ?? [];

  // Filtrera bort anrop äldre än RATE_LIMIT_WINDOW_MS
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  ipRequests.set(ip, recent);

  return recent.length > RATE_LIMIT_MAX;
}

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded, försök igen senare." },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(req.url);
  let symbol = searchParams.get("symbol");
  const type = searchParams.get("type");

  if (!symbol || !type) {
    return NextResponse.json(
      { error: "symbol och type krävs" },
      { status: 400 }
    );
  }

  symbol = symbol.toUpperCase();

  // Enkel symbol-validering: bara bokstäver och siffror
  if (!/^[A-Z0-9]+$/.test(symbol)) {
    return NextResponse.json(
      { error: "Ogiltigt symbolformat" },
      { status: 400 }
    );
  }

  try {
    const normalizedType =
      type === "stock-se" || type === "stock-us" ? "stock" : type;

    let price: number | null = null;
    let change24h: number | null = null;

    if (normalizedType === "crypto") {
      const coinId = COINGECKO_IDS[symbol];
      if (!coinId) {
        return NextResponse.json(
          { error: `Okänd kryptovaluta: ${symbol}` },
          { status: 400 }
        );
      }

      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=sek&include_24hr_change=true`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`CoinGecko-fel: ${res.statusText}`);
      }

      const data = await res.json();
      const coinData = data[coinId];

      price = coinData?.sek ?? null;
      change24h = coinData?.sek_24h_change ?? null;
    } else if (normalizedType === "stock") {
      const token = process.env.EODHD_API_KEY;
      if (!token) throw new Error("EODHD_API_KEY saknas");

      const url = `https://eodhd.com/api/real-time/${symbol}?api_token=${token}&fmt=json`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`EODHD API-fel: ${res.statusText}`);
      }

      const data = await res.json();

      price = data.close ?? null;
      change24h = data.change_p ?? null;
    } else {
      return NextResponse.json(
        { error: `Okänd type: ${type}` },
        { status: 400 }
      );
    }

    // Uppdatera Asset i databasen om pris eller change24h finns
    if (price !== null || change24h !== null) {
      await prisma.asset.updateMany({
        where: { symbol },
        data: {
          price: price !== null ? price : null,
          change24h: change24h !== null ? change24h : null,
          updatedAt: new Date(),
        },
      });
    }

    return NextResponse.json({ price, change24h });
  } catch (error: unknown) {
    console.error(`Fel vid hämtning av data för ${symbol} (${type}):`, error);
    return NextResponse.json(
      { error: "Fel vid hämtning av data" },
      { status: 500 }
    );
  }
}
