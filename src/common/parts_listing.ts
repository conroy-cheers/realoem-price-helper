import { CurrencyUnit, type PartDetail, type PartInfo } from "~common/types"

export function partsOrderedByPrice(parts: PartInfo[]): PartInfo[] {
  return parts.toSorted((a, b) => a.price - b.price)
}

export function formatPrice(part: PartInfo): string {
  const currencyStrings = {
    [CurrencyUnit.USD]: "$",
    [CurrencyUnit.AUD]: "A$",
    [CurrencyUnit.EUR]: "€"
  }
  const prefix = currencyStrings[part.currency]
  return prefix + part.price
}
