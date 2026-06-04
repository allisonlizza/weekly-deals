import type { Deal } from "./types";

/**
 * Whole Foods no longer exposes a scrapeable flyer API — their site
 * moved to fully client-side rendering. Until an alternative source
 * is available, we return an informational warning with a link.
 */
export async function fetchWholeFoodsDeals(
  storeId: string | undefined,
  _query: string,
): Promise<{ deals: Deal[]; warning?: string }> {
  const flyerUrl = storeId
    ? `https://www.wholefoodsmarket.com/sales-flyer?store-id=${storeId}`
    : "https://www.wholefoodsmarket.com/sales-flyer";

  return {
    deals: [],
    warning: `Whole Foods deals can't be fetched automatically right now — their site loads the flyer in the browser only. View this week's sales directly: ${flyerUrl}`,
  };
}
