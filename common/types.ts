import type { SearchConfig, SearchResult } from "./vendor"

type PartNumber = string

type CurrencyValue = string

enum CurrencyUnit {
  USD = "USD"
}

enum QualityLevel {
  Unknown = 0,
  Genuine = 1,
  OE = 2,
  Premium = 3,
  Midrange = 4,
  Budget = 5
}

type PartBrand = {
  name: string
  quality: QualityLevel
}

type PartInfo = {
  url: URL
  sku: string
  brand: PartBrand
  price: CurrencyValue
  currency: CurrencyUnit
}

type PartsListing = {
  parts: PartInfo[]
}

type SearchServiceRequest = {
  partNumber: PartNumber
}

type SearchServiceResponse = {
  config: SearchConfig
  result: SearchResult
}

export type {
  PartNumber,
  CurrencyValue,
  CurrencyUnit,
  PartBrand,
  PartInfo,
  PartsListing,
  SearchServiceRequest,
  SearchServiceResponse
}

export { QualityLevel }
