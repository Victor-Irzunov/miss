import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { Playfair_Display, Lora } from "next/font/google";

export const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["400","500","700","900"],
  display: "swap",
  variable: "--font-playfair",
});

export const lora = Lora({
  subsets: ["latin", "cyrillic"],
  weight: ["400","500","700"],
  display: "swap",
  variable: "--font-lora",
});

/** ====== БАЗОВЫЕ КОНСТАНТЫ ====== */
const SITE_NAME = "Академия моды Марины Кабадарян";
const PROJECT_NAME = "Премия красоты Женщина 2025";
const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") || "https://mkstyle.by/";

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `${PROJECT_NAME} — ${SITE_NAME}`,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "Официальный сайт «Премия красоты Женщина 2025». Участницы, новости, фото- и видеогалерея, партнёры и контакты Академии моды Марины Кабадарян.",
  keywords: [
    "Премия красоты",
    "Женщина 2025",
    "конкурс красоты",
    "Академия моды Марины Кабадарян",
    "участницы конкурса",
    "голосование",
    "партнёры",
    "галерея",
  ],
  applicationName: SITE_NAME,
  alternates: { canonical: "https://mkstyle.by/" },
  openGraph: {
    type: "website",
    url: BASE_URL,
    title: `${PROJECT_NAME} — ${SITE_NAME}`,
    siteName: SITE_NAME,
    description:
      "Узнайте всё о конкурсе «Женщина 2025»: участницы, новости, галерея и партнёры.",
    images: [
      {
        url: "/og/og-main.jpg", // положите лёгкий 1200×630 ~60–120KB
        width: 1200,
        height: 630,
        alt: `${PROJECT_NAME} — ${SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${PROJECT_NAME} — ${SITE_NAME}`,
    description:
      "Официальный сайт конкурса «Женщина 2025». Участницы, новости и галерея.",
    images: ["/og/og-main.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: { index: true, follow: true },
    yandex: "index, follow",
  },
  // Без тяжёлых JS: только то, что помогает мобильной производительности
  manifest: "/manifest.webmanifest",
};

/** Viewport: аккуратный zoom, цвет статус-бара, экономим на возможных reflow. */
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#111111" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  colorScheme: "dark light",
};

/** Лёгкие структурированные данные (JSON-LD) — помогают AEO/SEO, не влияют на LCP. */
function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/search?q={query}`,
      "query-input": "required name=query",
    },
  };

  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/logo/logo.webp`,
  };

  const event = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: PROJECT_NAME,
    eventStatus: "https://schema.org/EventScheduled",
    startDate: "2025-01-01", // при желании обновите реальной датой
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    organizer: {
      "@type": "Organization",
      name: SITE_NAME,
      url: BASE_URL,
    },
    url: BASE_URL,
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(event) }}
      />
    </>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        {/* Быстрый мобильный рендер */}
        <meta name="format-detection" content="telephone=no,email=no,address=no" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        {/* Preconnect/Preload добавляйте только при реальном использовании сторонних доменов (иначе лишний сетап) */}
      </head>
      <body className={`${lora.variable} ${playfair.variable} antialiased`}>
        {/* Якорь для плавного возврата к началу страницы */}
        <div id="top" className="sr-only" />

        <Header />

        {/* Контент страницы */}
        <main id="main" className="min-h-screen">
          {children}
        </main>

        <Footer />

        {/* Лёгкие JSON-LD для AEO/SEO */}
        <JsonLd />

        {/* Без сторонних виджетов и тяжёлых скриптов в layout — держим LCP/CLS низкими на мобильном */}
        <noscript>
          Ваш браузер не поддерживает JavaScript. Сайт будет работать, но часть
          функций может быть недоступна.
        </noscript>
      </body>
    </html>
  );
}
