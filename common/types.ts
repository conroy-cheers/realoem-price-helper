import type { SearchConfig } from "./vendor"

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

type PartSearchRequest = {
  partNumber: PartNumber
}

type PartSearchResponse = {
  success: boolean
  config: SearchConfig
  result?: PartInfo
  error?: string
}

export type {
  PartNumber,
  CurrencyUnit,
  Currency,
  PartInfo,
  SearchConfig,
  PartSearchRequest,
  PartSearchResponse
}
