import Link from "next/link";

type PageProps = {
  params: {
    slug: string;
  };
};

// Gör en URL-dekoderad visningsversion av slug, t.ex. "h%26m" → "H&M"
function deslugify(slug: string) {
  return decodeURIComponent(slug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function AssetPage({ params }: PageProps) {
  const { slug } = params;
  const assetName = deslugify(slug);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* Tillbaka-länk */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center text-blue-600 hover:underline dark:text-blue-400"
      >
        <span className="text-xl mr-2">←</span> Tillbaka
      </Link>

      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        {assetName}
      </h1>

      <p className="text-gray-700 dark:text-gray-300">
        Här kan du visa detaljerad information om <strong>{assetName}</strong>.
        Grafer, analyser, nyheter och historisk data kan läggas till här.
      </p>
    </div>
  );
}
