import type { PartDetail, PartInfo } from "~common/types"

export function partsOrderedByPrice(parts: PartInfo[]): PartInfo[] {
  return parts.toSorted(
    (a, b) => Number.parseFloat(a.price) - Number.parseFloat(b.price)
  )
}
