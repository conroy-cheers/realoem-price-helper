import type { QualityFilter } from "./quality_filter"
import type {
  DetailResult,
  SearchConfig,
  SearchResult,
  VendorPartIdentifier,
  VendorType
} from "./vendor"

export type PartNumber = string

export type CurrencyValue = string

export enum CurrencyUnit {
  USD = "USD",
  AUD = "AUD",
  EUR = "EUR"
}

export enum QualityLevel {
  // After Unknown, keys must be assigned in inverse order of quality.
  Unknown = 0,
  Genuine = 1,
  OE = 2,
  Premium = 3,
  Midrange = 4,
  Budget = 5
}

export type PartBrand = {
  name: string
  quality: QualityLevel
}

export type PartDetail = {
  image?: URL
}

export type PartInfo = {
  vendor: VendorType
  url: URL
  sku: string
  brand: PartBrand
  price: CurrencyValue
  currency: CurrencyUnit
  detail?: PartDetail
}

export type PartsListing = {
  parts: PartInfo[]
}

export type SearchServiceRequest = {
  partNumber: PartNumber
}

export type SearchServiceResponse = {
  config: SearchConfig
  result: SearchResult
}

export type DetailServiceRequest = {
  partIdentifier: VendorPartIdentifier
}

export type DetailServiceResponse = {
  result: DetailResult
}

export type Preferences = {
  globalPreferredQuality: QualityFilter
}

export type Setter<T> = (v: T) => void
