import type { RetailerId } from "./types";

export interface RetailerConfig {
  id: RetailerId;
  label: string;
  /** Flipp merchant_id when available */
  flippMerchantId?: number;
  /** Search term that returns mostly this store's weekly-ad items */
  flippBrowseQuery: string;
}

export const RETAILERS: Record<RetailerId, RetailerConfig> = {
  publix: {
    id: "publix",
    label: "Publix",
    flippMerchantId: 2361,
    flippBrowseQuery: "publix",
  },
  target: {
    id: "target",
    label: "Target",
    flippMerchantId: 2040,
    flippBrowseQuery: "target",
  },
  "whole-foods": {
    id: "whole-foods",
    label: "Whole Foods",
    flippBrowseQuery: "whole foods",
  },
  costco: {
    id: "costco",
    label: "Costco",
    flippMerchantId: 2519,
    flippBrowseQuery: "costco",
  },
};

export const DEFAULT_RETAILERS: RetailerId[] = ["publix", "target", "whole-foods", "costco"];
