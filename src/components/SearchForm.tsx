"use client";

import {
  loadPublixStorePreference,
  savePublixStorePreference,
} from "@/components/PreferredStores";
import { DEFAULT_PUBLIX_STORE } from "@/lib/preferred-stores";
import type { RetailerId } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const STORES: { id: RetailerId; label: string }[] = [
  { id: "publix", label: "Publix" },
  { id: "target", label: "Target" },
  { id: "whole-foods", label: "Whole Foods" },
  { id: "costco", label: "Costco" },
];

export function SearchForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [query, setQuery] = useState(params.get("q") ?? "");
  const [publixStore, setPublixStore] = useState(
    params.get("publixStore") ?? DEFAULT_PUBLIX_STORE,
  );

  const [stores, setStores] = useState<RetailerId[]>(() => {
    const raw = params.get("stores");
    if (!raw) return ["publix", "target", "whole-foods", "costco"];
    return raw.split(",").filter(Boolean) as RetailerId[];
  });

  useEffect(() => {
    if (!params.get("publixStore")) {
      setPublixStore(loadPublixStorePreference());
    }
  }, [params]);

  function handlePublixStoreChange(storeNumber: string) {
    setPublixStore(storeNumber);
    savePublixStorePreference(storeNumber);
  }

  function toggleStore(id: RetailerId) {
    setStores((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    savePublixStorePreference(publixStore);
    const next = new URLSearchParams();
    if (query.trim()) next.set("q", query.trim());
    next.set("publixStore", publixStore);
    if (stores.length && stores.length < 3) {
      next.set("stores", stores.join(","));
    }
    router.push(`/?${next.toString()}`);
  }

  return (
    <div className="space-y-5">
      <form
        onSubmit={onSubmit}
        className="space-y-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label
            htmlFor="query"
            className="mb-1 block text-sm font-medium text-stone-700"
          >
            Item or brand
          </label>
          <input
            id="query"
            type="search"
            placeholder="e.g. Cheerios, organic milk, Tide"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-stone-300 px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
          <p className="mt-1 text-xs text-stone-500">
            Leave blank to browse this week&apos;s ad highlights at each store.
          </p>
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-stone-700">
            Chains to search
          </legend>
          <div className="flex flex-wrap gap-3">
            {STORES.map((store) => (
              <label
                key={store.id}
                className="flex cursor-pointer items-center gap-2 rounded-full border border-stone-200 px-4 py-2 text-sm has-checked:border-emerald-500 has-checked:bg-emerald-50"
              >
                <input
                  type="checkbox"
                  checked={stores.includes(store.id)}
                  onChange={() => toggleStore(store.id)}
                  className="accent-emerald-600"
                />
                {store.label}
              </label>
            ))}
          </div>
        </fieldset>

        <button
          type="submit"
          className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 sm:w-auto sm:px-8"
        >
          Search deals
        </button>
      </form>
    </div>
  );
}
