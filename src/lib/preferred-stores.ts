import type { RetailerId } from "./types";

export interface PreferredStore {
  retailer: RetailerId;
  storeNumber: string;
  /** Whole Foods only: the storeId used in the sales-flyer URL */
  wfmStoreId?: string;
  shortName: string;
  address: string;
  city: string;
  zip: string;
}

/** Your usual stores — used for labels, deep links, and coupon URLs. */
export const PREFERRED_STORES: PreferredStore[] = [
  {
    retailer: "publix",
    storeNumber: "1363",
    shortName: "Town Brookhaven",
    address: "104 Town Blvd",
    city: "Brookhaven",
    zip: "30319",
  },
  {
    retailer: "target",
    storeNumber: "1486",
    shortName: "North Druid Hills",
    address: "2400 N Druid Hills Rd NE",
    city: "Atlanta",
    zip: "30329",
  },
  {
    retailer: "whole-foods",
    storeNumber: "10649",
    wfmStoreId: "10649",
    shortName: "Chamblee",
    address: "5001 Peachtree Blvd Bldg 300",
    city: "Chamblee",
    zip: "30341",
  },
  {
    retailer: "costco",
    storeNumber: "1084",
    shortName: "Brookhaven",
    address: "500 Brookhaven Ave NE",
    city: "Atlanta",
    zip: "30319",
  },
  {
    retailer: "sprouts",
    storeNumber: "519",
    shortName: "Morningside",
    address: "1845 Piedmont Ave NE",
    city: "Atlanta",
    zip: "30324",
  },
  {
    retailer: "kroger",
    storeNumber: "491",
    shortName: "Peachtree",
    address: "3871 Peachtree Rd NE",
    city: "Atlanta",
    zip: "30319",
  },
  {
    retailer: "aldi",
    storeNumber: "aldi-buford",
    shortName: "Buford Hwy",
    address: "3963 Buford Hwy NE",
    city: "Atlanta",
    zip: "30329",
  },
  {
    retailer: "lidl",
    storeNumber: "US01444",
    shortName: "Briarcliff",
    address: "2480 Briarcliff Rd NE",
    city: "Atlanta",
    zip: "30329",
  },
];

export const DEFAULT_PUBLIX_STORE = "1363";

export function getPreferredStoresForRetailer(
  retailer: RetailerId,
): PreferredStore[] {
  return PREFERRED_STORES.filter((s) => s.retailer === retailer);
}

export function getPreferredStore(
  retailer: RetailerId,
  storeNumber?: string,
): PreferredStore | undefined {
  const options = getPreferredStoresForRetailer(retailer);
  if (!storeNumber) return options[0];
  return options.find((s) => s.storeNumber === storeNumber) ?? options[0];
}

export function retailerWeeklyAdUrl(
  retailer: RetailerId,
  storeNumber?: string,
): string | undefined {
  const store = getPreferredStore(retailer, storeNumber);
  if (!store) return undefined;

  switch (retailer) {
    case "publix":
      return `https://www.publix.com/savings/weekly-ad?setstorenumber=${store.storeNumber}`;
    case "target":
      return `https://www.target.com/weekly-ad?store_id=${store.storeNumber}`;
    case "whole-foods": {
      const wfmStore = getPreferredStore("whole-foods", storeNumber);
      const sid = wfmStore?.wfmStoreId;
      return sid
        ? `https://www.wholefoodsmarket.com/sales-flyer?store-id=${sid}`
        : "https://www.wholefoodsmarket.com/sales-flyer";
    }
    case "costco":
      return "https://www.costco.com/savings-events.html";
    case "sprouts":
      return "https://www.sprouts.com/deals/";
    case "kroger":
      return "https://www.kroger.com/weeklyad";
    case "aldi":
      return "https://www.aldi.us/en/weekly-specials/";
    case "lidl":
      return "https://www.lidl.com/en/weekly-specials.htm";
    default:
      return undefined;
  }
}

export function retailerStorePageUrl(
  retailer: RetailerId,
  storeNumber?: string,
): string | undefined {
  const store = getPreferredStore(retailer, storeNumber);
  if (!store) return undefined;

  switch (retailer) {
    case "publix":
      return `https://www.publix.com/locations/${store.storeNumber}-${slugify(store.shortName)}`;
    case "target":
      return `https://www.target.com/sl/north-druid-hills/${store.storeNumber}`;
    case "whole-foods": {
      const wfm = getPreferredStore("whole-foods");
      return wfm
        ? `https://www.wholefoodsmarket.com/stores/${slugify(wfm.shortName)}`
        : "https://www.wholefoodsmarket.com/stores";
    }
    case "costco":
      return "https://www.costco.com/warehouse-locations/brookhaven-atlanta-ga-1084.html";
    case "sprouts":
      return `https://www.sprouts.com/store/ga/atlanta/atlanta-morningside/`;
    case "kroger":
      return `https://www.kroger.com/stores/details/011/00491`;
    case "aldi":
      return "https://stores.aldi.us/ga/atlanta/3963-buford-highway";
    case "lidl":
      return "https://www.lidl.com/stores/US01444";
    default:
      return undefined;
  }
}

export function getDefaultWfmStoreId(): string | undefined {
  return PREFERRED_STORES.find((s) => s.retailer === "whole-foods")?.wfmStoreId;
}

/** Flipp postal code — use the store's ZIP for slightly better local flyer matching. */
export function flippPostalCodeForSearch(
  retailers: RetailerId[],
  publixStoreNumber?: string,
): string {
  if (retailers.length === 1 && retailers[0] === "target") {
    return getPreferredStore("target")?.zip ?? "30319";
  }
  if (retailers.includes("publix") && publixStoreNumber) {
    return getPreferredStore("publix", publixStoreNumber)?.zip ?? "30319";
  }
  return getPreferredStore("publix", DEFAULT_PUBLIX_STORE)?.zip ?? "30319";
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/\s+/g, "-");
}
