import type { PartInfo } from "./types"

export function enumKeys<O extends object>(obj: O): number[] {
  return Object.keys(obj)
    .map((k) => Number(k))
    .filter((k) => !Number.isNaN(k))
}

export function partInfoKey(part: PartInfo) {
  return `${part.brand}-${part.sku}`
}
