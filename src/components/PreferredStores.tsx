import {
  DEFAULT_PUBLIX_STORE,
  getPreferredStoresForRetailer,
  PREFERRED_STORES,
  retailerStorePageUrl,
  retailerWeeklyAdUrl,
} from "@/lib/preferred-stores";

export function PreferredStores() {
  const publixOptions = getPreferredStoresForRetailer("publix");
  const target = getPreferredStoresForRetailer("target")[0];
  const wholeFoods = getPreferredStoresForRetailer("whole-foods")[0];

  return (
    <section className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
      <h2 className="text-sm font-semibold text-emerald-900">Your stores</h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {publixOptions.map((store) => (
          <div
            key={store.storeNumber}
            className="rounded-xl border border-emerald-200/80 bg-white px-4 py-3 text-sm"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-800 mb-1">Publix</p>
            <p className="font-medium text-stone-900">
              {store.shortName}{" "}
              <span className="font-normal text-stone-500">#{store.storeNumber}</span>
            </p>
            <p className="mt-0.5 text-xs text-stone-600">
              {store.address}, {store.city} {store.zip}
            </p>
          </div>
        ))}

        {target && (
          <div className="rounded-xl border border-emerald-200/80 bg-white px-4 py-3 text-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-800 mb-1">Target</p>
            <p className="font-medium text-stone-900">
              {target.shortName}{" "}
              <span className="font-normal text-stone-500">#{target.storeNumber}</span>
            </p>
            <p className="mt-0.5 text-xs text-stone-600">
              {target.address}, {target.city} {target.zip}
            </p>
          </div>
        )}

        {wholeFoods && (
          <div className="rounded-xl border border-emerald-200/80 bg-white px-4 py-3 text-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-800 mb-1">Whole Foods</p>
            <p className="font-medium text-stone-900">
              {wholeFoods.shortName}{" "}
              <span className="font-normal text-stone-500">#{wholeFoods.wfmStoreId}</span>
            </p>
            <p className="mt-0.5 text-xs text-stone-600">
              {wholeFoods.address}, {wholeFoods.city} {wholeFoods.zip}
            </p>
          </div>
        )}
      </div>

      <ul className="mt-4 flex flex-wrap gap-3 text-xs">
        {PREFERRED_STORES.map((store) => {
          const weekly = retailerWeeklyAdUrl(store.retailer, store.storeNumber);
          const page = retailerStorePageUrl(store.retailer, store.storeNumber);
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
    </section>
  );
}

export function loadPublixStorePreference(): string {
  if (typeof window === "undefined") return DEFAULT_PUBLIX_STORE;
  return localStorage.getItem("weekly-deals-publix-store") ?? DEFAULT_PUBLIX_STORE;
}

export function savePublixStorePreference(storeNumber: string): void {
  localStorage.setItem("weekly-deals-publix-store", storeNumber);
}
