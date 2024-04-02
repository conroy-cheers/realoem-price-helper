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
import { SearchConfig, VendorType, type Vendor } from "../vendor"

const URL_BASE = "https://schmiedmann.com"
const brandRegistry = new BrandRegistry()

export class SchmiedmannSearchConfig extends SearchConfig {
  vendorType = VendorType.Schmiedmann

  private static GET_PRODUCT_SEARCH_URL =
    "https://www.schmiedmann.com/WebService.asmx/GetProductSearch"
  private static PROCESS_SEARCH_URL =
    "https://www.schmiedmann.com/WebService.asmx/ProcessSearchRequest"

  protected async fetchPartsListing(): Promise<PartsListing> {
    const mybody = JSON.stringify(makeProcessSearchRequest(this.partNumber))
    const processSearchResponse = await fetch(
      SchmiedmannSearchConfig.PROCESS_SEARCH_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(makeProcessSearchRequest(this.partNumber))
      }
    )
    if (!processSearchResponse.ok) {
      const body = await processSearchResponse.text()
      const code = processSearchResponse.status
      throw Error(
        `API request failed with status ${processSearchResponse.status}`
      )
    }
    const processSearchResponseData = await processSearchResponse.json()
    const products: ProcessSearchProduct[] = JSON.parse(
      processSearchResponseData.d
    ).Products

    const getProductSearchResponse = await fetch(
      SchmiedmannSearchConfig.GET_PRODUCT_SEARCH_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(
          makeGetProductSearchRequest(
            products.map((searchProduct, index) => {
              return {
                Number: searchProduct.RawProductNumber,
                Index: index,
                UseSpecialOffer: "true",
                SupplierId: 0
              }
            })
          )
        )
      }
    )
    if (!getProductSearchResponse.ok) {
      throw Error(
        `API request failed with status ${processSearchResponse.status}`
      )
    }
    const searchResultsData: GetProductSearchResponse =
      await getProductSearchResponse.json()

    return {
      parts: await Promise.all(
        searchResultsData.d.Objects.Products.map(
          async (product) => await parseProduct(product)
        )
      )
    }
  }
}

type SearchProduct = {
  Id: number
  Index: number
  ProductNumber: string
  Description: string
  Models: string[]
  ShowModels: boolean
  ImageIds: number[]
  SelectedImage: number
  SelectedImageNo: number
  Currency: number
  Language: number
  BasePrice: number
  Discount: number
  PriceExVat: number
  PriceInclVat: number
  Deposit: number
  PricePerUnitStr: number | null
  UseSpecialOffer: boolean
  VatFactor: number
  Type: number
  IsUsed: boolean
  MinimumQuantity: number
  MinimumQuantityField: any | null
  ThumbHeight: number | null
  ThumbWidth: number | null
  LargeHeight: number | null
  LargeWidth: number | null
  ImageDescription: string
  ImageTitle: string
  Lightbox: any | null
  ManufacturersIds: string
  ManufacturersUrls: string
  ManufacturersNames: string
  DirectLink: string
  RemoveAddToCartFromSearch: boolean
}

type ProcessSearchProduct = {
  Id: number
  RawProductNumber: string
  RawParentProductNumber: string
  Title: string
  Description: string
  EnglishModelDescriptions: string | null
  PictureId: number
  New: boolean
  Warning: boolean
  Economic: boolean
  Original: string
  Unit: string
  Historical: boolean
  SupplierId: number
  SupplierProductNumber: string
  ArticleStateId: number
  Link: string
  HasUnoriginal: boolean
  ProductGroups: string
  MasterProductGroups: string
  ProductGroupsIds: string
  MasterProductGroupsIds: string
  ProductGroupsLinks: string
  MasterProductGroupsLinks: string
  Orientation: string
  ManufacturerProductNumber: number | null
  EANNumber: string
  Manufacturer: string
  ManufacturerId: string
  ProductType: number
}

type GetProductSearchRequestDataProduct = {
  Number: string
  Index: number
  UseSpecialOffer: string
  SupplierId: number
}

type GetProductSearchRequest = {
  data: string
  language: string
  currency: string
  vatFactor: number
}

type ProcessSearchRequest = {
  s: string
  pn: string
  ignore: string
}

function makeProcessSearchRequest(partNumber: string): ProcessSearchRequest {
  return {
    s: partNumber + "!English",
    pn: "0",
    ignore: "0"
  }
}

function makeGetProductSearchRequest(
  products: GetProductSearchRequestDataProduct[]
): GetProductSearchRequest {
  return {
    data: JSON.stringify({ Products: products }),
    language: "en",
    currency: "EUR",
    vatFactor: 0
  }
}

type GetProductSearchResponse = {
  d: {
    __type: string
    IsError: boolean
    Message: string
    Objects: {
      Products: SearchProduct[]
    }
  }
}

async function parseProduct(product: SearchProduct): Promise<PartInfo> {
  return {
    url: new URL(product.DirectLink, URL_BASE),
    sku: product.ProductNumber,
    brand: await brandRegistry.getBrand(product.ManufacturersNames),
    price: product.PriceExVat.toString(),
    currency: getCurrency(product.Currency),
    detail: {
      image: new URL(`/imagehandler/0/${product.ImageIds[0]}.jpg`, URL_BASE)
    }
  }
}

function getCurrency(currencyID: number): CurrencyUnit {
  switch (currencyID) {
    case 978:
      return CurrencyUnit.EUR
    default:
      throw TypeError("Unknown currency ID " + currencyID)
  }
}

export default class Schmiedmann implements Vendor {
  getVendorType(): VendorType {
    return VendorType.Schmiedmann
  }

  getUrlBase(): string {
    return URL_BASE
  }

  getSearchConfig(partNumber: PartNumber): SchmiedmannSearchConfig {
    return new SchmiedmannSearchConfig(partNumber)
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
}
