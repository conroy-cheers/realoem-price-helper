import { getConversionRate } from "./currency_rates"
import type { CurrencyUnit, PartInfo, PartsListing } from "./types"

async function convertPartCurrency(
  part: PartInfo,
  targetCurrency: CurrencyUnit
): Promise<PartInfo> {
  const ratio = await getConversionRate(part.currency, targetCurrency)
  return {
    ...part,
    currency: targetCurrency,
    price: Math.round(part.price * ratio * 100) / 100
  }
}

export async function mergePartsListings(
  partsListings: PartsListing[],
  targetCurrency: CurrencyUnit
): Promise<PartsListing> {
  let parts = partsListings.flatMap((listing) => listing.parts)

  const currencyConvertedParts = await Promise.all(
    parts.map((part) => convertPartCurrency(part, targetCurrency))
  )

  return {
    parts: currencyConvertedParts
  }
}
