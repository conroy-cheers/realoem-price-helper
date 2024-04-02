import { DomHandler } from "domhandler"
import { Parser } from "htmlparser2"

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

export function parseDocument(htmlString: string) {
  let result
  const handler = new DomHandler((error, dom) => {
    if (error) {
      result = null
    } else {
      result = dom
    }
  })
  const parser = new Parser(handler)
  parser.write(htmlString)
  parser.end()
  return result
}
