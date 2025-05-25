// components/AssetList.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link"; // 🆕 Importerat Link
import { Button } from "./ui/button";
import { slugify } from "@/lib/slugify";

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
  type: "stock-se" | "stock-us" | "crypto";
};

export default function AssetList({ title, type }: Props) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [prices, setPrices] = useState<Record<string, PriceData>>({});
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchAssets() {
      const res = await fetch(`/api/assets?type=${type}&page=${page}`);
      const data: Asset[] = await res.json();
      setAssets(data);
    }

    fetchAssets();
  }, [type, page]);

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
            newPrices[asset.symbol] = {
              price: data.price ?? null,
              change24h: data.change24h ?? null,
            };
          } catch (error) {
            console.error(`Kunde inte hämta pris för ${asset.symbol}:`, error);
            newPrices[asset.symbol] = { price: null, change24h: null };
          }
        })
      );
      setPrices(newPrices);
    }

    if (assets.length > 0) fetchPrices();
  }, [assets]);

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <table className="w-full text-left border-collapse border border-gray-300 dark:border-gray-600">
        <thead>
          <tr>
            <th className="border px-3 py-2">Namn</th>
            <th className="border px-3 py-2">Symbol</th>
            <th className="border px-3 py-2">Pris</th>
            <th className="border px-3 py-2">24h %</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => {
            const price = prices[asset.symbol]?.price;
            const change = prices[asset.symbol]?.change24h;

            return (
              <tr
                key={asset.symbol}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td className="border px-3 py-2">
                  <Link
                    href={`/asset/${slugify(asset.name)}`}
                    className="text-blue-600 hover:underline"
                  >
                    {asset.name}
                  </Link>
                </td>
                <td className="border px-3 py-2">{asset.symbol}</td>
                <td className="border px-3 py-2">
                  {price != null ? price.toFixed(2) : "–"}
                </td>
                <td
                  className={`border px-3 py-2 font-semibold ${
                    change != null
                      ? change > 0
                        ? "text-green-600"
                        : change < 0
                        ? "text-red-600"
                        : ""
                      : ""
                  }`}
                >
                  {change != null ? `${change.toFixed(2)}%` : "–"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Paginering */}
      <div className="flex justify-between mt-4">
        <Button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Föregående
        </Button>
        <Button onClick={() => setPage((p) => p + 1)}>Nästa</Button>
      </div>
    </section>
  );
}
