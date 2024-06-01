import { createFetchRequester } from "@algolia/requester-fetch"
import algoliasearch from "algoliasearch"
import * as CSSSelect from "css-select"
import { parseDocument } from "htmlparser2"

import { BrandRegistry } from "../brand_registry"
import {
  CurrencyUnit,
  type CurrencyValue,
  type PartDetail,
  type PartInfo,
  type PartNumber,
  type PartsListing
} from "../types"
import {
  SearchConfig,
  VendorType,
  type Vendor,
  type VendorPartIdentifier
} from "../vendor"

const URL_BASE = "https://runautoparts.com.au/"
const ALGOLIA_API_KEY = "b5a103e4dcfc662ad3ea04efee761397"
const ALGOLIA_APP_ID = "PIO7BZRWOS"
const brandRegistry = new BrandRegistry()

export class RunAutoPartsSearchConfig extends SearchConfig {
  vendorType = VendorType.RunAutoParts
  client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY, {
    requester: createFetchRequester()
  })

  protected async fetchPartsListing(): Promise<PartsListing> {
    const index = this.client.initIndex("magento2_default_products")
    try {
      const searchResponse = await index.search(this.partNumber, {})
      console.log(searchResponse)

      return {
        parts: await Promise.all(
          searchResponse.hits.map(async (hit) => {
            return {
              url: hit.url,
              sku: hit.sku,
              brand: await brandRegistry.getBrand(hit.brand),
              price: Number(hit.price.AUD.default),
              currency: CurrencyUnit.AUD,
              detail: {
                image: new URL(hit.thumbnail_url)
              } as PartDetail
            } as PartInfo
          })
        )
      }
    } catch (err) {
      throw Error(`API request failed`)
    }
  }
}

export default class RunAutoParts implements Vendor {
  getVendorType(): VendorType {
    return VendorType.RunAutoParts
  }

  getUrlBase(): string {
    return URL_BASE
  }

  getSearchConfig(partNumber: PartNumber): RunAutoPartsSearchConfig {
    return new RunAutoPartsSearchConfig(partNumber)
  }

  async fetchPartDetail(
    partIdentifier: VendorPartIdentifier
  ): Promise<PartDetail> {
    const detailResponse = await fetch(partIdentifier.url)
    if (!detailResponse.ok) {
      throw Error(`API request failed with status ${detailResponse.status}`)
    }

    const imageURL = await parseImageURL(await detailResponse.text())
    return {
      image: imageURL
    }
  }
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
