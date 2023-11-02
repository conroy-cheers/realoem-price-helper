import * as CSSSelect from "css-select"
import { parseDocument } from "htmlparser2"

import type { Currency, PartInfo, PartNumber } from "./types"
import type { SearchConfig, Vendor } from "./vendor"

export const URL_BASE = "https://cars245.com"

export class Cars245SearchConfig implements SearchConfig {
  searchUrl: URL

  constructor(searchUrl: URL) {
    this.searchUrl = searchUrl
  }

  async fetchPartInfo(): Promise<PartInfo> {
    const response = await fetch(this.searchUrl)
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }
    return parseSearchResult(await response.text())
  }
}

export default class Cars245 implements Vendor {
  getSearchConfig(partNumber: PartNumber): SearchConfig {
    return new Cars245SearchConfig(Cars245.buildQueryURL(partNumber))
  }

  private static buildQueryURL(partNumber: PartNumber): URL {
    const searchURL = "https://cars245.com/en/catalog/"
    let params = new URLSearchParams()
    params.append("q", partNumber)
    return new URL(searchURL + "?" + params.toString())
  }
}

function parseSearchResult(responseText: string): PartInfo {
  try {
    const doc = parseDocument(responseText)

    const anchorElement = CSSSelect.selectOne(
      'a[data-js-click-event="clickProductCard"]',
      doc
    ) as any
    if (anchorElement) {
      const url = new URL(anchorElement.attribs.href, URL_BASE)
      const sku = CSSSelect.selectOne('span[itemprop="sku"]', anchorElement)
        .firstChild.data
      const price = CSSSelect.selectOne('meta[itemprop="price"]', anchorElement)
        .attribs.content
      const currency = CSSSelect.selectOne(
        'meta[itemprop="priceCurrency"]',
        anchorElement
      ).attribs.content as Currency
      return { url, sku, price, currency }
    } else {
      throw Error("Product card not found")
    }
  } catch (error) {
    throw Error(`HTML parsing failed: ${error}`)
  }
}
