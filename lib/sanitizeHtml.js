// /lib/sanitizeHtml.client.js
"use client";
import DOMPurify from "isomorphic-dompurify";

/** Клиентская санитация HTML из CKEditor */
export function sanitizeHtml(html = "") {
  try {
    return DOMPurify.sanitize(String(html), {
      USE_PROFILES: { html: true },
      FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "link", "meta"],
      FORBID_ATTR: ["onerror", "onload"],
      ALLOW_DATA_ATTR: false,
    });
  } catch {
    return "";
  }
}
