// /app/girls/[slug]/page.jsx
import Gallery from "@/components/Girls/Gallery";
import VoteButton from "@/components/Vote/VoteButton";
import { notFound } from "next/navigation";
import { stripTags, truncateText } from "../../../lib/anitizeHtmlClient";
import YouTubeLazy from "@/components/Video/YouTubeLazy";

/** Карточные ярлыки для категорий */
const CAT_LABEL = {
  PLUS35: "35+",
  PLUS50: "50+",
  PLUS60: "60+",
  ONLINE: "Онлайн",
};

async function unwrapParams(p) {
  if (!p) return {};
  if (typeof p.then === "function") {
    try { return (await p) || {}; } catch { return {}; }
  }
  return p || {};
}

export async function generateMetadata({ params }) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  try {
    const { slug = "" } = await unwrapParams(params);
    if (!slug) throw new Error("no slug");
    const r = await fetch(`${base}/api/girls/${slug}`, { cache: "no-store" });
    if (!r.ok) throw new Error();
    const { item } = await r.json();

    const title = `${item.firstName} ${item.lastName} — Женщина 2025`;
    const descPlain = stripTags(item.description || "");
    const desc = truncateText(
      `${item.firstName} ${item.lastName} (${item.age} лет, ${item.city}). ${descPlain}`,
      180
    );

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
  if (!slug) return null;
  const r = await fetch(`${base}/api/girls/${slug}`, { cache: "no-store" });
  if (!r.ok) return null;
  const { item } = await r.json();
  return item;
}

export default async function GirlPage({ params }) {
  const { slug = "" } = await unwrapParams(params);
  const item = await getGirl(slug);
  if (!item) return notFound();

  const images = Array.isArray(item.images) && item.images.length ? item.images : [item.mainImage];
  const catUI = CAT_LABEL[item.category] || "35+";
  const videos = Array.isArray(item.videos) ? item.videos.filter(Boolean) : [];

  return (
    <main
      className="sd:py-40 xz:py-28 sd:px-0 xz:px-3"
      style={{
        backgroundImage: [
          "radial-gradient(1200px 800px at 15% 85%, rgba(152, 104, 44, 0.88) 0%, rgba(152, 104, 44, 0.58) 40%, rgba(152, 104, 44, 0) 70%)",
          "radial-gradient(900px 700px at 92% 8%, rgba(34, 74, 52, 0.70) 0%, rgba(34, 74, 52, 0.28) 45%, rgba(34, 74, 52, 0) 72%)",
          "radial-gradient(130% 100% at 50% 0%, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 55%)",
          "linear-gradient(180deg, #141826 5%, #1C1F2E 42%, #564733 100%)",
        ].join(", "),
        backgroundRepeat: "no-repeat, no-repeat, no-repeat, no-repeat",
        backgroundAttachment: "scroll, scroll, scroll, scroll",
        backgroundSize: "cover, cover, cover, cover",
        backgroundPosition: "center, center, center, center",
      }}
    >
      <div className="container mx-auto text-white">
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
              <span className="opacity-70">•</span>
              <span className="badge badge-success">Категория: {catUI}</span>
            </div>

            <div
              className="prose prose-invert max-w-none"
              suppressHydrationWarning
              dangerouslySetInnerHTML={{ __html: item.description }}
            />

            <VoteButton
              girlId={item.id}
              initialTotal={item.votesCount || 0}
              category={item.category}
              fullName={`${item.firstName} ${item.lastName}`}
            />
          </div>
        </div>

        {/* Видео — секция ниже карточки. Рендерим только если есть. */}
        {videos.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold mb-4">Видео</h2>
            <div className="grid grid-cols-1 sd:grid-cols-2 gap-6">
              {videos.map((u, idx) => (
                <YouTubeLazy key={`${item.id}-v-${idx}`} url={u} title={`Видео ${idx + 1}: ${item.firstName} ${item.lastName}`} />
              ))}
            </div>
          </section>
        )}
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
            additionalName: `Категория: ${catUI}`,
          }),
        }}
      />
    </main>
  );
}
