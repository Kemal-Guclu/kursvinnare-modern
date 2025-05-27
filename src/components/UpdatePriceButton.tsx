"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";

type Props = {
  symbol: string;
  type: string;
};

export default function UpdatePriceButton({ symbol, type }: Props) {
  const [isPending, startTransition] = useTransition();
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const handleUpdate = () => {
    startTransition(async () => {
      toast("Uppdaterar pris...");

      try {
        const res = await fetch(`/api/price?symbol=${symbol}&type=${type}`, {
          method: "GET",
        });

        if (!res.ok) throw new Error("Fel vid uppdatering");
        const data = await res.json();

        if (data.price !== null) {
          toast.success(`Pris uppdaterat: $${data.price.toFixed(2)}`);
          setLastUpdate(new Date());
        } else {
          toast("Inget pris tillgängligt.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Misslyckades att uppdatera pris.");
      }
    });
  };

  return (
    <div className="mt-6">
      <button
        onClick={handleUpdate}
        disabled={isPending}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
      >
        {isPending ? "Uppdaterar..." : "Uppdatera pris manuellt"}
      </button>
      {lastUpdate && (
        <p className="text-sm text-gray-500 mt-2">
          Uppdaterad: {lastUpdate.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
