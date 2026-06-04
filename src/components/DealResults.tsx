import {
  DEFAULT_PUBLIX_STORE,
  getPreferredStore,
  PREFERRED_STORES,
} from "@/lib/preferred-stores";
import { searchDeals, retailerIdsFromParam } from "@/lib/search";
import type { SearchParams } from "@/lib/types";
import { DealCard } from "./DealCard";

interface DealResultsProps {
  query: string;
  storesParam: string | null;
  wfmStoreId: string | null;
  publixStore: string;
}

export async function DealResults({
  query,
  storesParam,
  wfmStoreId,
  publixStore,
}: DealResultsProps) {
  const params: SearchParams = {
    query,
    postalCode: "30319",
    retailers: retailerIdsFromParam(storesParam),
    wholeFoodsStoreId: wfmStoreId ?? undefined,
    publixStoreNumber: publixStore || DEFAULT_PUBLIX_STORE,
  };

  const storeLabels = params.retailers.map((r) => {
    const store = getPreferredStore(r, r === "publix" ? publixStore : undefined);
    return store ? `${store.retailer === "publix" ? "Publix" : store.retailer === "target" ? "Target" : store.retailer === "whole-foods" ? "Whole Foods" : "Costco"} ${store.shortName}` : null;
  }).filter(Boolean);

  const { deals, warnings, fetchedAt } = await searchDeals(params);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-stone-800">
          {query.trim()
            ? `Results for “${query.trim()}”`
            : "This week’s highlights"}
        </h2>
        <p className="text-sm text-stone-500">
          {deals.length} deal{deals.length === 1 ? "" : "s"}
          {storeLabels.length > 0 && ` · ${storeLabels.join(" · ")}`}
        </p>
      </div>

      {warnings.length > 0 && (
        <ul className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {warnings.map((w) => {
            const urlMatch = w.match(/https?:\/\/\S+/);
            if (urlMatch) {
              const [before, ...rest] = w.split(urlMatch[0]);
              return (
                <li key={w}>
                  {before}
                  <a href={urlMatch[0]} target="_blank" rel="noopener noreferrer" className="underline font-medium">
                    View Whole Foods weekly flyer →
                  </a>
                  {rest.join("")}
                </li>
              );
            }
            return <li key={w}>{w}</li>;
          })}
        </ul>
      )}

      {deals.length === 0 ? (
        <p className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 py-8 text-center text-stone-600">
          No deals found. Try another search term, ZIP, or store selection.
        </p>
      ) : (
        <ul className="grid gap-3 lg:grid-cols-2">
          {deals.map((deal) => (
            <li key={deal.id}>
              <DealCard deal={deal} publixStoreNumber={publixStore} />
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-stone-400">
        Updated {new Date(fetchedAt).toLocaleString()} · Flyer data for{" "}
        {PREFERRED_STORES.filter((s) =>
          params.retailers.includes(s.retailer),
        )
          .map((s) => `${s.shortName} (#${s.storeNumber})`)
          .join(", ") || "your stores"}
        . Prices are regional; confirm in store.
      </p>
    </section>
  );
}
