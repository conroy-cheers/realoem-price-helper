import type { SearchConfig, SearchResult } from "./vendor"

type PartNumber = string

type CurrencyUnit = string

enum Currency {
  USD = "USD"
}

type PartInfo = {
  url: URL
  sku: string
  price: CurrencyUnit
  currency: Currency
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
  CurrencyUnit,
  Currency,
  PartInfo,
  SearchConfig,
  SearchServiceRequest,
  SearchServiceResponse
}
