// /components/Girls/DescriptionHTML.jsx
"use client";

import { sanitizeHtml } from "@/lib/sanitizeHtml";

export default function DescriptionHTML({ html }) {
  return (
    <div
      className="text-base leading-relaxed"
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(html || "") }}
    />
  );
}
