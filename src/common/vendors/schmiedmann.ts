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

const URL_BASE = "https://www.schmiedmann.com"
const brandRegistry = new BrandRegistry()

const GET_PRODUCT_SEARCH_URL =
  "https://www.schmiedmann.com/WebService.asmx/GetProductSearch"
const PROCESS_SEARCH_URL =
  "https://www.schmiedmann.com/WebService.asmx/ProcessSearchRequest"

export class SchmiedmannSearchConfig extends SearchConfig {
  vendorType = VendorType.Schmiedmann

  protected async fetchPartsListing(): Promise<PartsListing> {
    const processSearchResponse = await fetch(PROCESS_SEARCH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(makeProcessSearchRequest(this.partNumber))
    })
    if (!processSearchResponse.ok) {
      throw Error(
        `API request failed with status ${processSearchResponse.status}`
      )
    }
    const processSearchResponseData = await processSearchResponse.json()
    const products: ProcessSearchProduct[] = JSON.parse(
      processSearchResponseData.d
    ).Products
    return fetchProductInfo(
      products.map((product) => {
        return {
          productNumber: product.RawProductNumber,
          supplierID: product.SupplierId
        }
      })
    )
  }
}

type ProductSearchItem = {
  productNumber: string
  supplierID: number
}

async function fetchProductInfo(products: ProductSearchItem[]) {
  const getProductSearchResponse = await fetch(GET_PRODUCT_SEARCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(
      makeGetProductSearchRequest(
        products.map((product, index) => {
          return {
            Number: product.productNumber,
            Index: index,
            UseSpecialOffer: "true",
            SupplierId: product.supplierID
          }
        })
      )
    )
  })
  if (!getProductSearchResponse.ok) {
    throw Error(
      `API request failed with status ${getProductSearchResponse.status}`
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
    language: "English",
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
    vendor: VendorType.Schmiedmann,
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

  async fetchPartDetail(
    partIdentifier: VendorPartIdentifier
  ): Promise<PartDetail> {
    const [supplierIDstr, productNumber] = partIdentifier.id.split("_", 1)
    const supplierID = Number(supplierIDstr)
    const products = await fetchProductInfo([{ productNumber, supplierID }])
    return products.parts[0].detail
  }
}
