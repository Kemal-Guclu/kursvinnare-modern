import { NextRequest, NextResponse } from "next/server";

const COINGECKO_IDS: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  XRP: "ripple",
  ADA: "cardano",
  DOGE: "dogecoin",
  // Lägg till fler vid behov
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");
  const type = searchParams.get("type");

  if (!symbol || !type) {
    return NextResponse.json(
      { error: "Missing symbol or type" },
      { status: 400 }
    );
  }

  try {
    // Crypto via CoinGecko
    if (type === "crypto") {
      const id = COINGECKO_IDS[symbol.toUpperCase()];
      if (!id) {
        return NextResponse.json(
          { error: `Unsupported crypto symbol: ${symbol}` },
          { status: 400 }
        );
      }

      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=sek&days=1&interval=hourly`
      );
      if (!res.ok) throw new Error("Failed to fetch crypto data");
      const data = await res.json();
      return NextResponse.json({ data });
    }

    // Aktier via EODHD
    if (type === "stock") {
      const EODHD_API_KEY = process.env.EODHD_API_KEY;
      if (!EODHD_API_KEY) throw new Error("Missing EODHD_API_KEY");

      const res = await fetch(
        `https://eodhd.com/api/real-time/${symbol}?api_token=${EODHD_API_KEY}&fmt=json`
      );
      if (!res.ok) throw new Error("Failed to fetch stock data from EODHD");
      const data = await res.json();
      return NextResponse.json({ data });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error: unknown) {
    // Hantera fel och logga dem
    if (error instanceof Error) {
      console.error("API Error:", error.message);
    } else {
      console.error("API Error:", error);
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// import { NextResponse } from "next/server";

// const COINGECKO_URL = "https://api.coingecko.com/api/v3/coins";
// // const FINNHUB_URL = "https://finnhub.io/api/v1/quote";

// // const COINGECKO_URL = "https://api.coingecko.com/api/v3/simple/price";
// const EODHD_URL = "https://eodhd.com/api/eod";

// const COINGECKO_IDS: Record<string, string> = {
//   BTC: "bitcoin",
//   ETH: "ethereum",
//   SOL: "solana",
//   XRP: "ripple",
//   ADA: "cardano",
//   DOGE: "dogecoin",
// };
// // const FINNHUB_MAP: Record<string, string> = {
// //   "VOLV-B.ST": "VOLV B.ST",
// //   "VOLCAR-B.ST": "VOLCAR B.ST",
// //   TSLA: "TSLA",
// //   AAPL: "AAPL",
// //   // Lägg till fler aktier vid behov
// // };

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const symbol = searchParams.get("symbol");
//   const type = searchParams.get("type");

//   if (!symbol || !type) {
//     return NextResponse.json(
//       { error: "Missing symbol or type" },
//       { status: 400 }
//     );
//   }

//   try {
//     // Krypto
//     if (type === "crypto") {
//       const coinId = COINGECKO_IDS[symbol.toUpperCase()];
//       if (!coinId) {
//         return NextResponse.json(
//           { error: "Unsupported crypto symbol" },
//           { status: 400 }
//         );
//       }
//       const url = `${COINGECKO_URL}/${coinId}/market_chart?vs_currency=usd&days=7`;

//       const res = await fetch(url);
//       const data = await res.json();

//       if (!data || !data.prices) {
//         return NextResponse.json(
//           { error: "Invalid data from CoinGecko" },
//           { status: 500 }
//         );
//       }

//       const prices = data.prices.map(
//         ([timestamp, price]: [number, number]) => ({
//           date: new Date(timestamp).toISOString().split("T")[0],
//           price: price.toFixed(2),
//         })
//       );

//       return NextResponse.json(prices);
//     }

//     // Aktie – försök med olika suffix (för att stödja både .ST och .US)
//     const suffixes = ["", ".ST", ".US"];
//     type PriceEntry = { date: string; close: number };
//     let finalData: PriceEntry[] | null = null;

//     for (const suffix of suffixes) {
//       const url = `${EODHD_URL}/${symbol}${suffix}?api_token=${process.env.EODHD_API_KEY}&fmt=json&order=d`;

//       const res = await fetch(url);
//       const text = await res.text();

//       try {
//         const json = JSON.parse(text);

//         if (Array.isArray(json) && json.length >= 2) {
//           finalData = json;
//           break;
//         }

//         // Om json är ett error-meddelande
//         if (typeof json === "object" && json.error) {
//           console.warn(`API Error (${symbol}${suffix}):`, json.error);
//         }
//       } catch (err) {
//         console.error(`JSON parse error for symbol ${symbol}${suffix}:`, err);
//         // Det var inte giltig JSON
//         console.warn(`Invalid JSON for symbol ${symbol}${suffix}:`, text);
//       }
//     }

//     if (!finalData) {
//       return NextResponse.json({ error: "Ticker Not Found" }, { status: 404 });
//     }
//     const prices = finalData.map((entry: PriceEntry) => ({
//       date: entry.date,
//       price: entry.close.toFixed(2),
//     }));

//     return NextResponse.json(prices);
//   } catch (error) {
//     console.error("Fel vid hämtning av data:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
