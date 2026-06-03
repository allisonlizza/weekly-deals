import {
  getPreferredStore,
  retailerWeeklyAdUrl,
} from "@/lib/preferred-stores";
import type { Deal } from "@/lib/types";
import Image from "next/image";

function formatMoney(value: number | null): string | null {
  if (value === null) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function DealCard({
  deal,
  publixStoreNumber,
}: {
  deal: Deal;
  publixStoreNumber?: string;
}) {
  const storeNumber =
    deal.retailer === "publix"
      ? publixStoreNumber ?? getPreferredStore("publix")?.storeNumber
      : deal.retailer === "target"
        ? getPreferredStore("target")?.storeNumber
        : undefined;
  const weeklyAdUrl = retailerWeeklyAdUrl(deal.retailer, storeNumber);
  const price = formatMoney(deal.currentPrice);
  const was = formatMoney(deal.originalPrice);
  const badge =
    deal.kind === "bogo"
      ? "BOGO"
      : deal.saleStory
        ? "Deal"
        : price
          ? "Sale"
          : "Offer";

  return (
    <article className="flex gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:border-emerald-300 hover:shadow-md">
      {deal.imageUrl ? (
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-stone-100">
          <Image
            src={deal.imageUrl}
            alt=""
            fill
            className="object-contain p-1"
            sizes="96px"
            unoptimized
          />
        </div>
      ) : (
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-2xl text-stone-400">
          %
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
            {deal.retailerLabel}
          </span>
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-900">
            {badge}
          </span>
        </div>
        <h3 className="text-base font-semibold leading-snug text-stone-900">
          {deal.name}
        </h3>
        {deal.brand && (
          <p className="mt-0.5 text-sm text-stone-500">{deal.brand}</p>
        )}
        <div className="mt-2 flex flex-wrap items-baseline gap-2">
          {price && (
            <span className="text-lg font-bold text-emerald-700">{price}</span>
          )}
          {was && (
            <span className="text-sm text-stone-400 line-through">{was}</span>
          )}
          {deal.priceText && (
            <span className="text-sm text-stone-600">{deal.priceText}</span>
          )}
        </div>
        {deal.saleStory && (
          <p className="mt-1 text-sm font-medium text-amber-800">
            {deal.saleStory}
          </p>
        )}
        {deal.validTo && (
          <p className="mt-2 text-xs text-stone-400">
            Through {new Date(deal.validTo).toLocaleDateString()}
          </p>
        )}
        {weeklyAdUrl && (
          <a
            href={weeklyAdUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-xs font-medium text-emerald-700 hover:underline"
          >
            View on {deal.retailerLabel} weekly ad →
          </a>
        )}
      </div>
    </article>
  );
}
