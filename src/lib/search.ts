import { fetchRetailerDealsFromFlipp } from "./flipp";
import { flippPostalCodeForSearch, getPreferredStore } from "./preferred-stores";
import { RETAILERS } from "./retailers";
import { fetchWholeFoodsDeals } from "./wholefoods";
import type { RetailerId, SearchParams, SearchResult } from "./types";

export async function searchDeals(params: SearchParams): Promise<SearchResult> {
  const warnings: string[] = [];
  const dealsById = new Map<string, import("./types").Deal>();
  const flippZip =
    params.postalCode ||
    flippPostalCodeForSearch(
      params.retailers,
      params.publixStoreNumber,
    );

  const tasks = params.retailers.map(async (retailer) => {
    if (retailer === "whole-foods") {
      const { deals, warning } = await fetchWholeFoodsDeals(
        params.wholeFoodsStoreId,
        params.query,
      );
      if (warning) warnings.push(warning);
      return deals;
    }

    if (!RETAILERS[retailer].flippMerchantId) {
      warnings.push(`${RETAILERS[retailer].label} is not on Flipp in your area.`);
      return [];
    }

    try {
      const storeCode =
        retailer === "publix"
          ? params.publixStoreNumber
          : retailer === "target"
            ? "1486"
            : undefined;
      const zip = getPreferredStore(retailer)?.zip ?? flippZip;

      return await fetchRetailerDealsFromFlipp(
        retailer,
        zip,
        params.query,
        storeCode,
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      warnings.push(`${RETAILERS[retailer].label}: ${msg}`);
      return [];
    }
  });

  const batches = await Promise.all(tasks);
  for (const batch of batches) {
    for (const deal of batch) {
      dealsById.set(deal.id, deal);
    }
  }

  const deals = [...dealsById.values()].sort((a, b) => {
    const priceA = a.currentPrice ?? Number.POSITIVE_INFINITY;
    const priceB = b.currentPrice ?? Number.POSITIVE_INFINITY;
    if (priceA !== priceB) return priceA - priceB;
    return a.name.localeCompare(b.name);
  });

  return {
    deals,
    fetchedAt: new Date().toISOString(),
    warnings,
  };
}

export function retailerIdsFromParam(value: string | null): RetailerId[] {
  if (!value) return ["publix", "target", "whole-foods", "costco", "sprouts", "kroger", "aldi", "lidl"];
  const allowed = new Set<RetailerId>(["publix", "target", "whole-foods", "costco", "sprouts", "kroger", "aldi", "lidl"]);
  return value
    .split(",")
    .map((s) => s.trim() as RetailerId)
    .filter((id) => allowed.has(id));
}
