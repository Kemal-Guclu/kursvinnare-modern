// app/asset/[slug]/page.tsx
import Link from "next/link";
import AddToWatchlist from "@/components/AddToWatchlist";
import prisma from "@/lib/prisma";

type Params = {
  slug: string;
};

type AssetPageProps = {
  params: Params;
};

export default async function AssetPage({ params }: AssetPageProps) {
  const { slug } = params;

  // Hämta tillgången från databasen
  const asset = await prisma.asset.findUnique({
    where: { slug },
  });

  // Visa fel om tillgång inte hittades
  if (!asset) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4">
        <Link
          href="/"
          className="mb-6 inline-flex items-center text-blue-600 hover:underline dark:text-blue-400"
        >
          <span className="text-xl mr-2">←</span> Tillbaka
        </Link>
        <p className="text-red-600">Tillgång hittades inte.</p>
      </div>
    );
  }

  const {
    name,
    type,
    price,
    change24h,
    symbol,
    updatedAt,
    slug: assetSlug,
  } = asset;

  // Säkerställ att type är antingen "stock" eller "crypto"
  const assetType: "stock" | "crypto" = type === "crypto" ? "crypto" : "stock";

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Link
        href="/"
        className="mb-6 inline-flex items-center text-blue-600 hover:underline dark:text-blue-400"
      >
        <span className="text-xl mr-2">←</span> Tillbaka
      </Link>

      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
        {name} ({symbol})
      </h1>

      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Typ: <strong>{type}</strong>
      </p>

      <p className="mb-2 text-lg font-semibold">
        Pris:{" "}
        {price !== null ? (
          <span className="text-green-600">${price.toFixed(2)}</span>
        ) : (
          <span className="text-gray-500">Ingen data</span>
        )}
      </p>

      <p className="mb-4 text-lg font-semibold">
        24h förändring:{" "}
        {change24h !== null ? (
          <span className={change24h >= 0 ? "text-green-600" : "text-red-600"}>
            {change24h.toFixed(2)}%
          </span>
        ) : (
          <span className="text-gray-500">Ingen data</span>
        )}
      </p>

      <p className="text-sm text-gray-500 mb-6">
        Senast uppdaterad: {updatedAt.toLocaleString()}
      </p>

      <AddToWatchlist assetName={name} slug={assetSlug} type={assetType} />
    </div>
  );
}
