import type { PartInfo } from "./types"

type EnumType = { [s: number]: string }

export function enumKeys<O extends EnumType>(obj: O): number[] {
  return Object.keys(obj)
    .map((k) => Number(k))
    .filter((k) => !Number.isNaN(k))
}

export function partInfoKey(part: PartInfo) {
  return `${part.brand}-${part.sku}`
}
