import Link from "next/link";

type AssetListProps = {
  title: string;
  assets: string[];
};

function slugify(name: string) {
  return encodeURIComponent(name.toLowerCase().replace(/\s+/g, "-"));
}

export function AssetList({ title, assets }: AssetListProps) {
  return (
    <section className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        {title}
      </h3>
      <ul className="space-y-2">
        {assets.map((asset) => (
          <li key={asset}>
            <Link
              href={`/asset/${slugify(asset)}`}
              className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-800 dark:text-gray-100"
            >
              {asset}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
