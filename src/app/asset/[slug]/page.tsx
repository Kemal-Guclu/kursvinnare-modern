// app/asset/[slug]/page.tsx
import Link from "next/link";
import AddToWatchlist from "@/components/AddToWatchlist"; // Importera din klientkomponent

type Params = {
  slug: string;
};

type AssetPageProps = {
  params: Params;
};

// Enkel deslugifiering för att visa namn snyggt
function deslugify(slug: string) {
  return decodeURIComponent(slug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

// Funktion för att hämta prisdata från backend-API
async function fetchPrice(slug: string, type: "crypto" | "stock") {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || ""
      }/api/price?symbol=${encodeURIComponent(slug)}&type=${type}`,
      { cache: "no-store" } // "no-store" för att alltid få färsk data
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.price ?? null;
  } catch (error) {
    console.error("Fel vid hämtning av pris:", error);
    return null;
  }
}

export default async function AssetPage({ params }: AssetPageProps) {
  const { slug } = params;
  const assetName = deslugify(slug);

  // Bestäm typ baserat på slug (exempel)
  const cryptos = ["bitcoin", "ethereum", "solana"];
  const type = cryptos.includes(slug.toLowerCase()) ? "crypto" : "stock";

  // Hämta prisdata på servern
  const price = await fetchPrice(slug, type);

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

      {/* Lägg till en klientkomponent för watchlist-interaktion */}
      <AddToWatchlist assetName={assetName} slug={slug} type={type} />
    </div>
  );
}
