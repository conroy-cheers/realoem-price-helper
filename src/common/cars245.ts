import * as CSSSelect from "css-select"
import { parseDocument } from "htmlparser2"

import { BrandRegistry } from "./brand_registry"
import type {
  CurrencyUnit,
  CurrencyValue,
  PartDetail,
  PartInfo,
  PartNumber,
  PartsListing
} from "./types"
import { SearchConfig, VendorType, type Vendor } from "./vendor"

const URL_BASE = "https://cars245.com"
const brandRegistry = new BrandRegistry()

export class Cars245SearchConfig extends SearchConfig {
  vendorType = VendorType.Cars245

  protected async fetchPartsListing(): Promise<PartsListing> {
    const searchResponse = await fetch(this.searchUrl)
    if (!searchResponse.ok) {
      throw Error(`API request failed with status ${searchResponse.status}`)
    }

    const canonicalPart = await parseSearchResult(
      await searchResponse.text(),
      this.partNumber
    )

    // Load canonical part's URL and scrape the Alternative Products table
    const canonicalPartResponse = await fetch(canonicalPart.url)
    if (!canonicalPartResponse.ok) {
      throw Error(
        `Request to ${canonicalPart.url.toString()} failed with status ${
          canonicalPartResponse.status
        }`
      )
    }

    const alternativeParts = await parseAlternativeParts(
      await canonicalPartResponse.text(),
      canonicalPart.currency
    )

    return {
      parts: [canonicalPart].concat(alternativeParts)
    }
  }
}

export default class Cars245 implements Vendor {
  getVendorType(): VendorType {
    return VendorType.Cars245
  }

  getUrlBase(): string {
    return URL_BASE
  }

  getSearchConfig(partNumber: PartNumber): Cars245SearchConfig {
    return new Cars245SearchConfig(
      partNumber,
      Cars245.buildQueryURL(partNumber)
    )
  }

  async fetchPartDetail(partURL: URL): Promise<PartDetail> {
    const detailResponse = await fetch(partURL)
    if (!detailResponse.ok) {
      throw Error(`API request failed with status ${detailResponse.status}`)
    }

    const imageURL = await parseImageURL(await detailResponse.text())
    return {
      image: imageURL
    }
  }

  private static buildQueryURL(partNumber: PartNumber): URL {
    const searchURL = "https://cars245.com/en/catalog/"
    let params = new URLSearchParams()
    params.append("q", partNumber)
    return new URL(searchURL + "?" + params.toString())
  }
}

async function parseSearchResult(
  responseText: string,
  canonicalSku: string
): Promise<PartInfo> {
  try {
    const doc = parseDocument(responseText)
    const productAnchors = CSSSelect.selectAll(
      'a[data-js-click-event="clickProductCard"]',
      doc
    ) as any[]
    const partInfos = await Promise.all(productAnchors.map(getPartInfo))

    // find first productAnchor with brand BMW
    const canonicalPart = getCanonicalPart(partInfos, canonicalSku)
    return canonicalPart
  } catch (error) {
    throw Error(`HTML parsing failed: ${error}`)
  }
}

async function getPartInfo(productAnchor): Promise<PartInfo> {
  const url = new URL(productAnchor.attribs.href, URL_BASE)
  const sku = CSSSelect.selectOne('span[itemprop="sku"]', productAnchor)
    .firstChild.data
  const price = CSSSelect.selectOne('meta[itemprop="price"]', productAnchor)
    .attribs.content
  const currency = CSSSelect.selectOne(
    'meta[itemprop="priceCurrency"]',
    productAnchor
  ).attribs.content as CurrencyUnit
  const brandText = CSSSelect.selectOne(
    ".product-card__cont-supplier-img",
    productAnchor
  ).attribs.alt
  const brand = await brandRegistry.getBrand(brandText)
  return { url, sku, brand, price, currency }
}

function getCanonicalPart(
  candidates: PartInfo[],
  canonicalSku: string
): PartInfo {
  let matchingParts: PartInfo[] = []

  for (const candidate of candidates) {
    if (candidate.brand.name === "BMW" && candidate.sku === canonicalSku) {
      matchingParts.push(candidate)
    }
  }

  if (matchingParts.length < 1) {
    throw Error("Matching product card not found")
  } else if (matchingParts.length > 1) {
    throw Error(
      `${matchingParts.length} matching product cards found; expected 1`
    )
  }

  return matchingParts[0]
}

async function parseImageURL(responseText: string): Promise<URL | null> {
  try {
    const doc: any = parseDocument(responseText)
    const imageElem = CSSSelect.selectOne("img.unit-product__images-img", doc)
    if (!imageElem) {
      return null
    }
    return new URL(imageElem.attribs.src, URL_BASE)
  } catch (error) {
    return null
  }
}

async function parseAlternativeParts(
  responseText: string,
  currency: CurrencyUnit
): Promise<PartInfo[]> {
  try {
    const doc = parseDocument(responseText)
    const alternatesTable = CSSSelect.selectOne(
      "table.table-alternate-products",
      doc
    )
    const alternativesRows = CSSSelect.selectAll(
      "tr.table-alternate-products__hasproduct",
      alternatesTable
    )
    const partInfos: PartInfo[] = []
    for (const rowElement of alternativesRows) {
      const partInfo = await parseAlternatePartRow(rowElement, currency)
      if (partInfo) partInfos.push(partInfo)
    }
    return partInfos
  } catch (error) {
    throw Error(`HTML parsing failed: ${error}`)
  }
}

async function parseAlternatePartRow(
  rowElement,
  currency: CurrencyUnit
): Promise<PartInfo> {
  const rawBrandText: string = rowElement.children[1].firstChild.data

  const skuLink = CSSSelect.selectOne("a", rowElement.children[3])
  if (!skuLink) {
    return undefined
  }
  const rawSkuText: string = skuLink.firstChild.data
  const rawPartUrl: string = skuLink.attribs.href

  const priceDiv = CSSSelect.selectOne("div.price", rowElement)
  if (!priceDiv) {
    return undefined
  }
  const rawPriceBig: string = priceDiv.children[0].data
  const rawPriceSmall: string = priceDiv.children[1].firstChild.data

  const brand = await brandRegistry.getBrand(rawBrandText.trim())
  const sku = rawSkuText.replaceAll(" ", "")
  const url = new URL(rawPartUrl, URL_BASE)
  const price = rawPriceBig.replace("$", "") + rawPriceSmall

  return {
    brand,
    sku,
    url,
    price,
    currency
  }
}
