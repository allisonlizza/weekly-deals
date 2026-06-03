# Weekly Deals

Search this week's sales and promotions at **Publix**, **Target**, and **Whole Foods** by item or brand, filtered to your ZIP.

## How it works

| Store | Data source |
|-------|-------------|
| **Publix** | [Flipp](https://flipp.com) weekly flyer API (`merchant_id` 2361) |
| **Target** | Flipp weekly flyer API (`merchant_id` 2040) |
| **Whole Foods** | wholefoodsmarket.com sales flyer (requires your **store id**) |

Flipp powers many grocers' digital weekly ads. This app queries their public search endpoint and filters to your selected stores. Whole Foods does not appear on Flipp in all areas; their site only loads promos after you choose a store.

**Note:** Scraping and unofficial APIs can break or conflict with retailer terms of use. This is built for personal shopping use—not for redistribution or commercial scraping.

## Prerequisites

1. **Node.js 20+** and npm — install via [nodejs.org](https://nodejs.org/) or `brew install node`
2. **Git** (optional) — macOS will prompt for Xcode Command Line Tools if `git` is missing

## Run locally

```bash
cd ~/Projects/weekly-deals
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Your stores (defaults)

| Chain | Store | # | Address |
|-------|--------|---|---------|
| Publix | Town Brookhaven | 1363 | 104 Town Blvd, Brookhaven 30319 |
| Target | North Druid Hills | 1486 | 2400 N Druid Hills Rd NE, Atlanta 30329 |


## Whole Foods store id

1. Visit [wholefoodsmarket.com/sales-flyer](https://www.wholefoodsmarket.com/sales-flyer)
2. Choose your store
3. Copy the `storeId` from the URL (if present) into the app field

If promos stay empty, their API shape may have changed—open an issue or we can add zip → store lookup.

## API

`GET /api/deals?zip=30319&q=milk&stores=publix,target&wfmStoreId=123`

## Project layout

- `src/lib/flipp.ts` — Publix & Target flyer search
- `src/lib/wholefoods.ts` — Whole Foods sales flyer (store-specific)
- `src/lib/search.ts` — Merges results across retailers
- `src/app/page.tsx` — Search UI and results

## Next steps (ideas)

- Save your ZIP and stores in local storage
- Zip → Whole Foods store auto-select
- Publix digital coupons (separate from flyer items)
- Email or list export for a shopping trip
