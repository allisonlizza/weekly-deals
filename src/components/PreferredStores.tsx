"use client";

import {
  DEFAULT_PUBLIX_STORE,
  getPreferredStoresForRetailer,
  PREFERRED_STORES,
  retailerStorePageUrl,
  retailerWeeklyAdUrl,
} from "@/lib/preferred-stores";

interface PreferredStoresProps {
  publixStore: string;
  onPublixStoreChange: (storeNumber: string) => void;
}

export function PreferredStores({
  publixStore,
  onPublixStoreChange,
}: PreferredStoresProps) {
  const publixOptions = getPreferredStoresForRetailer("publix");
  const target = getPreferredStoresForRetailer("target")[0];
  const wholeFoods = getPreferredStoresForRetailer("whole-foods")[0];

  return (
    <section className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
      <h2 className="text-sm font-semibold text-emerald-900">Your stores</h2>
      <p className="mt-1 text-xs text-emerald-800/80">
        Weekly ad prices are regional (Atlanta metro). Digital coupons and
        in-store stock follow the store you pick for Publix.
      </p>

      <div className="mt-4 space-y-4">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-emerald-800">
            Publix
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {publixOptions.map((store) => (
              publixOptions.length === 1 ? (
                <div
                  key={store.storeNumber}
                  className="rounded-xl border border-emerald-200/80 bg-white px-4 py-3 text-sm"
                >
                  <p className="font-medium text-stone-900">
                    {store.shortName}{" "}
                    <span className="font-normal text-stone-500">
                      #{store.storeNumber}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-stone-600">
                    {store.address}, {store.city} {store.zip}
                  </p>
                </div>
              ) : (
                <label
                  key={store.storeNumber}
                  className={`flex cursor-pointer flex-col rounded-xl border px-4 py-3 text-sm transition ${
                    publixStore === store.storeNumber
                      ? "border-emerald-500 bg-white shadow-sm"
                      : "border-emerald-200/80 bg-white/50 hover:bg-white"
                  }`}
                >
                  <span className="flex items-center gap-2 font-medium text-stone-900">
                    <input
                      type="radio"
                      name="publixStore"
                      value={store.storeNumber}
                      checked={publixStore === store.storeNumber}
                      onChange={() => onPublixStoreChange(store.storeNumber)}
                      className="accent-emerald-600"
                    />
                    {store.shortName}
                    <span className="font-normal text-stone-500">
                      #{store.storeNumber}
                    </span>
                  </span>
                  <span className="mt-1 pl-6 text-xs text-stone-600">
                    {store.address}, {store.city} {store.zip}
                  </span>
                </label>
              )
            ))}
          </div>
        </div>

        {target && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-emerald-800">
              Target
            </p>
            <div className="rounded-xl border border-emerald-200/80 bg-white px-4 py-3 text-sm">
              <p className="font-medium text-stone-900">
                {target.shortName}{" "}
                <span className="font-normal text-stone-500">
                  #{target.storeNumber}
                </span>
              </p>
              <p className="mt-1 text-xs text-stone-600">
                {target.address}, {target.city} {target.zip}
              </p>
            </div>
          </div>
        )}

        {wholeFoods && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-emerald-800">
              Whole Foods
            </p>
            <div className="rounded-xl border border-emerald-200/80 bg-white px-4 py-3 text-sm">
              <p className="font-medium text-stone-900">
                {wholeFoods.shortName}{" "}
                <span className="font-normal text-stone-500">
                  #{wholeFoods.wfmStoreId}
                </span>
              </p>
              <p className="mt-1 text-xs text-stone-600">
                {wholeFoods.address}, {wholeFoods.city} {wholeFoods.zip}
              </p>
            </div>
          </div>
        )}

        <ul className="flex flex-wrap gap-3 text-xs">
          {PREFERRED_STORES.map((store) => {
            const weekly = retailerWeeklyAdUrl(
              store.retailer,
              store.storeNumber,
            );
            const page = retailerStorePageUrl(
              store.retailer,
              store.storeNumber,
            );
            return (
              <li key={`${store.retailer}-${store.storeNumber}`}>
                <a
                  href={weekly ?? page}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 underline-offset-2 hover:underline"
                >
                  {store.retailer === "publix"
                    ? "Publix"
                    : store.retailer === "target"
                      ? "Target"
                      : "Whole Foods"}{" "}
                  {store.shortName} weekly ad →
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function loadPublixStorePreference(): string {
  if (typeof window === "undefined") return DEFAULT_PUBLIX_STORE;
  return (
    localStorage.getItem("weekly-deals-publix-store") ?? DEFAULT_PUBLIX_STORE
  );
}

export function savePublixStorePreference(storeNumber: string): void {
  localStorage.setItem("weekly-deals-publix-store", storeNumber);
}
