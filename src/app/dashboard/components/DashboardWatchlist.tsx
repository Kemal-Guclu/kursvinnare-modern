"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

type Asset = {
  id: string;
  name: string;
  slug: string;
  type: string;
};

type WatchlistItem = {
  id: string;
  asset: Asset;
};

export default function DashboardWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  const fetchWatchlist = async () => {
    const res = await axios.get<WatchlistItem[]>("/api/watchlist");
    setWatchlist(res.data);
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const removeFromWatchlist = async (id: string) => {
    await axios.delete(`/api/watchlist/delete/${id}`);
    setWatchlist((prev) => prev.filter((item) => item.id !== id));
  };

  if (watchlist.length === 0) {
    return <p className="mt-6 text-center">Din watchlist är tom.</p>;
  }

  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-xl font-semibold">Din Watchlist</h2>
      <ul className="space-y-2">
        {watchlist.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-3 rounded"
          >
            <span>{item.asset.name}</span>
            <Button
              variant="destructive"
              onClick={() => removeFromWatchlist(item.id)}
            >
              Ta bort
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
