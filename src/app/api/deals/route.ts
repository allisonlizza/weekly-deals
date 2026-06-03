import { retailerIdsFromParam, searchDeals } from "@/lib/search";
import { getDefaultWfmStoreId } from "@/lib/preferred-stores";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q") ?? "";
  const postalCode = searchParams.get("zip") ?? "30319";
  const retailers = retailerIdsFromParam(searchParams.get("stores"));
  const wholeFoodsStoreId =
    searchParams.get("wfmStoreId") ?? getDefaultWfmStoreId();
  const publixStoreNumber = searchParams.get("publixStore") ?? "1363";

  if (!/^\d{5}(-\d{4})?$/.test(postalCode.trim())) {
    return NextResponse.json(
      { error: "Please provide a valid US ZIP code." },
      { status: 400 },
    );
  }

  const result = await searchDeals({
    query,
    postalCode: postalCode.trim().slice(0, 5),
    retailers,
    wholeFoodsStoreId,
    publixStoreNumber,
  });

  return NextResponse.json(result);
}
