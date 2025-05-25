"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

type PageProps = {
  params: {
    slug: string;
  };
};

function deslugify(slug: string) {
  return decodeURIComponent(slug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function AssetPage({ params }: PageProps) {
  const { slug } = params;
  const assetName = deslugify(slug);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [price, setPrice] = useState<number | null>(null);
  const [type, setType] = useState<"crypto" | "stock">("stock");

  // Kolla om asset är crypto eller stock baserat på slug (enkelt exempel)
  useEffect(() => {
    const cryptos = ["bitcoin", "ethereum", "solana"];
    if (cryptos.includes(slug.toLowerCase())) {
      setType("crypto");
    } else {
      setType("stock");
    }
  }, [slug]);

  // Hämta realtidspris från /api/price
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch(
          `/api/price?symbol=${encodeURIComponent(slug)}&type=${type}`
        );
        const data = await res.json();
        if (data.price !== undefined && data.price !== null) {
          setPrice(data.price);
        } else {
          setPrice(null);
        }
      } catch (error) {
        setPrice(null);
        console.error("Fel vid hämtning av pris:", error);
      }
    };

    fetchPrice();
  }, [slug, type]);

  const handleAddToWatchlist = async () => {
    setLoading(true);
    try {
      const assetRes = await fetch("/api/asset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: assetName,
          type,
          symbol: slug.toUpperCase(),
        }),
      });

      if (!assetRes.ok) {
        const error = await assetRes.json();
        toast.error("Fel: " + error.error);
        return;
      }

      const assetData = await assetRes.json();

      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetId: assetData.id }),
      });

      if (res.ok) {
        toast.success("Tillagd i din watchlist!");
        setIsInWatchlist(true);
      } else {
        const error = await res.json();
        toast.error("Fel: " + error.error);
      }
    } catch (err) {
      console.error("Fel:", err);
      toast.error("Något gick fel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Link
        href="/"
        className="mb-6 inline-flex items-center text-blue-600 hover:underline dark:text-blue-400"
      >
        <span className="text-xl mr-2">←</span> Tillbaka
      </Link>

      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        {assetName}
      </h1>

      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Här kan du visa detaljerad information om <strong>{assetName}</strong>.
        Grafer, analyser, nyheter och historisk data kan läggas till här.
      </p>

      <p className="mb-4 text-lg font-semibold">
        Pris:{" "}
        {price !== null ? (
          <span className="text-green-600">${price.toFixed(2)}</span>
        ) : (
          <span className="text-gray-500">Ingen data</span>
        )}
      </p>

      {session?.user && (
        <div className="mb-4">
          <Button
            onClick={handleAddToWatchlist}
            disabled={loading || isInWatchlist}
          >
            {loading
              ? "Lägger till..."
              : isInWatchlist
              ? "Redan i watchlist"
              : "Lägg till i Watchlist"}
          </Button>
        </div>
      )}
    </div>
  );
}
