// components/AssetList.tsx
"use client";

import { useEffect, useState } from "react";

type Asset = {
  symbol: string;
  name: string;
  type: "stock" | "crypto";
};

type PriceData = {
  price: number | null;
  change24h: number | null;
};

type Props = {
  title: string;
  assets: Asset[];
};

export default function AssetList({ title, assets }: Props) {
  const [prices, setPrices] = useState<Record<string, PriceData>>({});

  useEffect(() => {
    async function fetchPrices() {
      const newPrices: Record<string, PriceData> = {};
      await Promise.all(
        assets.map(async (asset) => {
          try {
            const res = await fetch(
              `/api/price?symbol=${encodeURIComponent(asset.symbol)}&type=${
                asset.type
              }`
            );
            const data = await res.json();

            // API: price, change24h
            newPrices[asset.symbol] = {
              price: data.price ?? null,
              change24h: data.change24h ?? null,
            };
          } catch (error) {
            console.error(
              `Fel vid hämtning av pris för ${asset.symbol}:`,
              error
            );
            newPrices[asset.symbol] = { price: null, change24h: null };
          }
        })
      );
      setPrices(newPrices);
    }

    fetchPrices();

    // Uppdatera var 60:e sekund
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, [assets]);

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <table className="w-full text-left border-collapse border border-gray-300 dark:border-gray-600">
        <thead>
          <tr>
            <th className="border border-gray-300 px-3 py-2">Namn</th>
            <th className="border border-gray-300 px-3 py-2">Symbol</th>
            <th className="border border-gray-300 px-3 py-2">Pris (USD)</th>
            <th className="border border-gray-300 px-3 py-2">24h %</th>
          </tr>
        </thead>
        <tbody>
          {assets.map(({ symbol, name }) => {
            const priceData = prices[symbol];
            const price = priceData?.price;
            const change = priceData?.change24h;

            return (
              <tr
                key={symbol}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td className="border border-gray-300 px-3 py-2">{name}</td>
                <td className="border border-gray-300 px-3 py-2">{symbol}</td>
                <td className="border border-gray-300 px-3 py-2">
                  {price !== null && price !== undefined
                    ? price.toFixed(2)
                    : "–"}
                </td>
                <td
                  className={`border border-gray-300 px-3 py-2 font-semibold ${
                    change !== null && change !== undefined
                      ? change > 0
                        ? "text-green-600"
                        : change < 0
                        ? "text-red-600"
                        : ""
                      : ""
                  }`}
                >
                  {change !== null && change !== undefined
                    ? `${change.toFixed(2)}%`
                    : "–"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
