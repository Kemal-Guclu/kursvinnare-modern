"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SparklineChart } from "./SparklineChart";
import { toast } from "sonner";
import { slugify } from "@/lib/slugify";

type Asset = {
  symbol: string;
  name: string;
  type: "stock" | "crypto";
  iconUrl?: string;
};

type PriceData = {
  price: number | null;
  change24h: number | null;
  sparkline?: number[];
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
      try {
        const res = await fetch(`/api/assets?type=${type}&page=${page}`);
        if (!res.ok) throw new Error("Kunde inte hämta tillgångar");
        const text = await res.text();
        const data: Asset[] = text ? JSON.parse(text) : [];
        setAssets(data);
      } catch (err) {
        console.error("Fel vid hämtning:", err);
        setAssets([]);
        toast.error("Kunde inte hämta tillgångar");
      }
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
            if (!res.ok) throw new Error("Kunde inte hämta pris");
            const text = await res.text();
            const data = text ? JSON.parse(text) : {};
            newPrices[asset.symbol] = {
              price: data.price ?? null,
              change24h: data.change24h ?? null,
              sparkline: data.sparkline ?? [],
            };
          } catch (err) {
            console.error(`Fel för ${asset.symbol}:`, err);
            newPrices[asset.symbol] = { price: null, change24h: null };
          }
        })
      );

      setPrices(newPrices);
    }

    if (assets.length > 0) fetchPrices();
  }, [assets]);

  async function addToWatchlist(asset: Asset) {
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        body: JSON.stringify(asset),
      });

      if (!res.ok) {
        throw new Error("Kunde inte lägga till i watchlist");
      }

      toast.success(`${asset.name} tillagd i watchlist`);
    } catch (error) {
      console.error(error);
      toast.error("Fel: Kunde inte lägga till i watchlist");
    }
  }

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="space-y-4">
        {assets.map((asset) => {
          const price = prices[asset.symbol]?.price;
          const change = prices[asset.symbol]?.change24h;
          const sparkline = prices[asset.symbol]?.sparkline || [];

          return (
            <Card key={asset.symbol} className="p-3">
              <CardContent className="space-y-2">
                {/* Rad 1: Ikon, namn, symbol, sparkline */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    {asset.iconUrl && (
                      <Image
                        src={asset.iconUrl}
                        alt={asset.symbol}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    )}
                    <Link
                      href={`/asset/${slugify(asset.name)}`}
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      {asset.name} ({asset.symbol})
                    </Link>
                  </div>
                  {sparkline.length > 0 && (
                    <div className="w-32">
                      <SparklineChart data={sparkline} />
                    </div>
                  )}
                </div>

                {/* Rad 2: Pris, förändring, Watchlist-knapp */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex flex-col">
                    <span className="text-gray-500">Pris:</span>
                    <span className="font-medium">
                      {price != null ? `${price.toFixed(2)} kr` : "–"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500">24h:</span>
                    <span
                      className={`font-semibold ${
                        change != null
                          ? change > 0
                            ? "text-green-600"
                            : "text-red-600"
                          : "text-gray-400"
                      }`}
                    >
                      {change != null ? `${change.toFixed(2)}%` : "–"}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addToWatchlist(asset)}
                  >
                    + Watchlist
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {assets.length === 0 && (
          <p className="text-sm text-gray-500">Inga tillgångar hittades.</p>
        )}
      </div>

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
