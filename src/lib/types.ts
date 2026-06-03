export type RetailerId = "publix" | "target" | "whole-foods" | "costco";

export type DealKind = "sale" | "coupon" | "bogo";

export interface Deal {
  id: string;
  retailer: RetailerId;
  retailerLabel: string;
  name: string;
  brand?: string;
  currentPrice: number | null;
  originalPrice: number | null;
  priceText?: string;
  saleStory: string | null;
  kind: DealKind;
  validFrom?: string;
  validTo?: string;
  imageUrl?: string;
  source: "flipp" | "whole-foods";
}

export interface SearchParams {
  query: string;
  postalCode: string;
  retailers: RetailerId[];
  wholeFoodsStoreId?: string;
  /** Publix store # for coupon links and local flyer ZIP (1363 or 1777). */
  publixStoreNumber?: string;
}

export interface SearchResult {
  deals: Deal[];
  fetchedAt: string;
  warnings: string[];
}
