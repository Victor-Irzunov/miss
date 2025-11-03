// /app/girls/[slug]/page.jsx
import { notFound } from "next/navigation";
import Gallery from "@/components/Girls/Gallery";
import DescriptionHTML from "@/components/Girls/DescriptionHTML";
import { stripTags, truncateText } from "@/lib/text";

export async function generateMetadata({ params }) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  try {
    const { slug } = await params;
    const r = await fetch(`${base}/api/girls/${slug}`, { cache: "no-store" });
    if (!r.ok) throw new Error();
    const { item } = await r.json();

    const title = `${item.firstName} ${item.lastName} — Женщина 2025`;
    const descPlain = stripTags(item.description || "");
    const desc = truncateText(`${item.firstName} ${item.lastName} (${item.age} лет, ${item.city}). ${descPlain}`, 180);

    return {
      title,
      description: desc,
      openGraph: { title, description: desc, images: [{ url: item.mainImage }] },
      alternates: { canonical: `${base}/girls/${item.slug}` },
    };
  } catch {
    return { title: "Участница — Женщина 2025" };
  }
}

async function getGirl(slug) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  const r = await fetch(`${base}/api/girls/${slug}`, { cache: "no-store" });
  if (!r.ok) return null;
  const { item } = await r.json();
  return item;
}

export default async function GirlPage({ params }) {
  const { slug } = await params;
  const item = await getGirl(slug);
  if (!item) return notFound();

  const images = Array.isArray(item.images) && item.images.length ? item.images : [item.mainImage];

  return (
    <main className="container mx-auto sd:py-14 xz:py-8 sd:px-0 xz:px-3">
      <div className="grid sd:grid-cols-2 xz:grid-cols-1 gap-6">
        <div>
          <Gallery images={images} alt={`${item.firstName} ${item.lastName}`} />
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-extrabold">
            {item.firstName} {item.lastName}
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="badge">{item.age} лет</span>
            <span className="opacity-70">•</span>
            <span>{item.city}</span>
          </div>
          <DescriptionHTML html={item.description} />
        </div>
      </div>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: `${item.firstName} ${item.lastName}`,
            homeLocation: item.city,
            image: item.mainImage,
            description: stripTags(item.description || ""),
            url: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/girls/${item.slug}`,
          }),
        }}
      />
    </main>
  );
}
