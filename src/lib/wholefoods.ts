import type { Deal } from "./types";

/**
 * Whole Foods weekly promos are store-specific on wholefoodsmarket.com.
 * The public sales-flyer page loads deals only after a store is selected.
 */
export async function fetchWholeFoodsDeals(
  storeId: string | undefined,
  query: string,
): Promise<{ deals: Deal[]; warning?: string }> {
  if (!storeId?.trim()) {
    return {
      deals: [],
      warning:
        "Whole Foods deals need your store. Open wholefoodsmarket.com/sales-flyer, pick your store, then copy the store id from the URL (or ask us to add zip → store lookup next).",
    };
  }

  try {
    const buildId = await getNextBuildId();
    const url = `https://www.wholefoodsmarket.com/_next/data/${buildId}/sales-flyer.json?storeId=${encodeURIComponent(storeId.trim())}`;

    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "weekly-deals/0.1 (personal use)",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return {
        deals: [],
        warning: `Whole Foods flyer request failed (${res.status}). Check your store id.`,
      };
    }

    const data = (await res.json()) as {
      pageProps?: {
        promotions?: WholeFoodsPromotion[];
        storeName?: string;
      };
    };

    const promotions = data.pageProps?.promotions ?? [];
    let deals = promotions.map((p, i) => promotionToDeal(p, i));

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      deals = deals.filter((d) =>
        [d.name, d.brand, d.saleStory]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }

    return { deals };
  } catch {
    return {
      deals: [],
      warning:
        "Could not load Whole Foods promotions. Their site may have changed or blocked the request.",
    };
  }
}

interface WholeFoodsPromotion {
  title?: string;
  name?: string;
  brand?: string;
  price?: string;
  salePrice?: string;
  regularPrice?: string;
  description?: string;
  image?: { url?: string };
  validFrom?: string;
  validTo?: string;
}

let cachedBuildId: string | null = null;

async function getNextBuildId(): Promise<string> {
  if (cachedBuildId) return cachedBuildId;

  const res = await fetch("https://www.wholefoodsmarket.com/sales-flyer", {
    headers: { "User-Agent": "weekly-deals/0.1 (personal use)" },
    next: { revalidate: 86400 },
  });
  const html = await res.text();
  const match = html.match(/\/_next\/static\/([^/]+)\/_buildManifest\.js/);
  if (!match?.[1]) {
    throw new Error("Could not detect Whole Foods Next.js build id");
  }
  cachedBuildId = match[1];
  return cachedBuildId;
}

function promotionToDeal(p: WholeFoodsPromotion, index: number): Deal {
  const name = p.title ?? p.name ?? p.description ?? "Weekly special";
  const current = parsePrice(p.salePrice ?? p.price);
  const original = parsePrice(p.regularPrice);

  return {
    id: `wfm-${index}-${name.slice(0, 40)}`,
    retailer: "whole-foods",
    retailerLabel: "Whole Foods",
    name,
    brand: p.brand,
    currentPrice: current,
    originalPrice: original,
    saleStory: p.description ?? null,
    kind: "sale",
    validFrom: p.validFrom,
    validTo: p.validTo,
    imageUrl: p.image?.url,
    source: "whole-foods",
  };
}

function parsePrice(value?: string): number | null {
  if (!value) return null;
  const n = parseFloat(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : null;
}
