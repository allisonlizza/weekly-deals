import type { Deal, DealKind, RetailerId } from "./types";
import { RETAILERS } from "./retailers";

const FLIPP_BASE = "https://backflipp.wishabi.com/flipp";

interface FlippItem {
  id: number;
  name: string;
  merchant_id: number;
  merchant_name?: string;
  current_price: number | null;
  original_price: number | null;
  pre_price_text?: string | null;
  post_price_text?: string | null;
  sale_story?: string | null;
  clean_image_url?: string;
  valid_from?: string;
  valid_to?: string;
  item_type?: string;
}

interface FlippSearchResponse {
  items?: FlippItem[];
  coupons_v2?: FlippCoupon[];
}

interface FlippCoupon {
  id: number;
  name?: string;
  brand?: string;
  merchant_name?: string;
  merchant_id?: number;
  current_price?: number | null;
  original_price?: number | null;
  sale_story?: string | null;
  image_url?: string;
  valid_from?: string;
  valid_to?: string;
}

function formatPriceText(item: FlippItem): string | undefined {
  const parts = [item.pre_price_text, item.post_price_text].filter(Boolean);
  return parts.length ? parts.join(" ") : undefined;
}

function inferKind(saleStory: string | null | undefined): DealKind {
  const s = (saleStory ?? "").toLowerCase();
  if (s.includes("bogo") || s.includes("buy one") || s.includes("b1g1")) {
    return "bogo";
  }
  return "sale";
}

function flippItemToDeal(
  item: FlippItem,
  retailer: RetailerId,
): Deal | null {
  const config = RETAILERS[retailer];
  if (
    config.flippMerchantId &&
    item.merchant_id !== config.flippMerchantId
  ) {
    return null;
  }

  return {
    id: `flipp-${item.id}`,
    retailer,
    retailerLabel: config.label,
    name: item.name,
    currentPrice: item.current_price,
    originalPrice: item.original_price,
    priceText: formatPriceText(item),
    saleStory: item.sale_story ?? null,
    kind: inferKind(item.sale_story),
    validFrom: item.valid_from,
    validTo: item.valid_to,
    imageUrl: item.clean_image_url,
    source: "flipp",
  };
}

export async function fetchFlippItems(
  postalCode: string,
  query: string,
  storeCode?: string,
): Promise<FlippItem[]> {
  const url = new URL(`${FLIPP_BASE}/items/search`);
  url.searchParams.set("locale", "en");
  url.searchParams.set("postal_code", postalCode);
  url.searchParams.set("q", query);
  if (storeCode) {
    url.searchParams.set("store_code", storeCode);
  }

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Flipp search failed (${res.status})`);
  }

  const data = (await res.json()) as FlippSearchResponse;
  return data.items ?? [];
}

export async function fetchRetailerDealsFromFlipp(
  retailer: RetailerId,
  postalCode: string,
  userQuery: string,
  storeCode?: string,
): Promise<Deal[]> {
  const config = RETAILERS[retailer];
  const flippQuery = userQuery.trim() || config.flippBrowseQuery;
  const items = await fetchFlippItems(postalCode, flippQuery, storeCode);

  const now = Date.now();
  const deals = items
    .map((item) => flippItemToDeal(item, retailer))
    .filter((d): d is Deal => d !== null)
    .filter((d) => !d.validTo || new Date(d.validTo).getTime() > now);

  if (!userQuery.trim()) {
    return deals;
  }

  const q = userQuery.trim().toLowerCase();
  return deals.filter((d) => matchesQuery(d, q));
}

function matchesQuery(deal: Deal, q: string): boolean {
  const haystack = [deal.name, deal.brand, deal.saleStory, deal.priceText]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}
