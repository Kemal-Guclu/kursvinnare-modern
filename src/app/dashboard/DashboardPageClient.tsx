"use client";

import Link from "next/link";
import DashboardWatchlist from "./components/DashboardWatchlist";

export default function DashboardPageClient({ name }: { name: string }) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">
        Välkommen till din dashboard, {name}!
      </h1>
      <Link
        href="/dashboard/profile"
        className="text-blue-600 underline hover:text-blue-800"
      >
        Uppdatera profil
      </Link>

      <DashboardWatchlist />
    </div>
  );
}
