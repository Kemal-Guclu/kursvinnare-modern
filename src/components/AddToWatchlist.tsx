"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button"; // Justera sökvägen vid behov
import { toast } from "react-hot-toast";

type Props = {
  assetName: string;
  slug: string;
  type: "stock" | "crypto";
};

export default function AddToWatchlist({ assetName, slug, type }: Props) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  // Kolla om asset redan finns i watchlist när komponenten laddas
  useEffect(() => {
    async function checkWatchlist() {
      if (!session?.user) return; // Säkerställ att användare är inloggad

      try {
        const res = await fetch(`/api/watchlist/check?slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          setIsInWatchlist(data.exists);
        } else {
          setIsInWatchlist(false);
        }
      } catch (error) {
        console.error("Kunde inte kolla watchlist:", error);
        setIsInWatchlist(false);
      }
    }
    checkWatchlist();
  }, [slug, session]);

  const handleAddToWatchlist = async () => {
    setLoading(true);
    try {
      // Skapa asset i DB (om den inte finns)
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
        setLoading(false);
        return;
      }

      const assetData = await assetRes.json();

      // Lägg till asset i watchlist
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

  if (!session?.user) return null;

  return (
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
  );
}
