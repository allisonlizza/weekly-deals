import { DealResults } from "@/components/DealResults";
import { SearchForm } from "@/components/SearchForm";
import { DEFAULT_PUBLIX_STORE, getDefaultWfmStoreId } from "@/lib/preferred-stores";
import { PreferredStores } from "@/components/PreferredStores";
import { Suspense } from "react";

interface HomeProps {
  searchParams: Promise<{
    q?: string;
    stores?: string;
    publixStore?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const sp = await searchParams;
  const publixStore = sp.publixStore?.trim() || DEFAULT_PUBLIX_STORE;
  const hasSearch = Boolean(
    sp.q !== undefined ||
      sp.stores !== undefined ||
      sp.publixStore !== undefined,
  );

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <header className="mb-10">
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
          Weekly Deals
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          What&apos;s on sale where you shop
        </h1>
        <p className="mt-3 max-w-2xl text-stone-600">
          Search by item or brand across Publix, Target, Whole Foods, and Costco.
          See BOGOs, percent-off promos, and weekly flyer prices.
        </p>
      </header>

      <Suspense fallback={<div className="h-48 animate-pulse rounded-2xl bg-stone-200" />}>
        <SearchForm />
      </Suspense>

      {hasSearch && (
        <div className="mt-10">
          <Suspense
            fallback={
              <p className="text-center text-stone-500">Loading deals…</p>
            }
          >
            <DealResults
              query={sp.q ?? ""}
              storesParam={sp.stores ?? null}
              wfmStoreId={getDefaultWfmStoreId() ?? null}
              publixStore={publixStore}
            />
          </Suspense>
        </div>
      )}

      {!hasSearch && (
        <p className="mt-8 text-center text-sm text-stone-500">
          Pick your stores and search — or leave the item blank to browse
          this week&apos;s ad highlights.
        </p>
      )}

      <div className="mt-10">
        <PreferredStores />
      </div>
    </main>
  );
}
