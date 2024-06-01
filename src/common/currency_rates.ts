import "isomorphic-fetch"

import type { CurrencyUnit } from "./types"

type CurrencyData = { [key: string]: number }
type ApiResponse<QueryKey extends string> = {
  date: string
  QueryKey: CurrencyData
}

const cache: { [key: string]: { data: CurrencyData; expiry: number } } = {}

async function fetchCurrencyData(baseCurrency: string): Promise<CurrencyData> {
  const cacheKey = `currency_${baseCurrency}`
  const now = Date.now()

  // Check cache in browser (localStorage) or Node (in-memory)
  if (typeof window !== "undefined") {
    const cachedData = localStorage.getItem(cacheKey)
    if (cachedData) {
      const { data, expiry } = JSON.parse(cachedData)
      if (expiry > now) {
        return data
      }
    }
  } else {
    if (cache[cacheKey] && cache[cacheKey].expiry > now) {
      return cache[cacheKey].data
    }
  }

  const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${baseCurrency}.json`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch data for base currency: ${baseCurrency}`)
  }
  const data: ApiResponse<typeof baseCurrency> = await response.json()

  // Cache the data with expiry of 6 hours
  const expiry = now + 6 * 60 * 60 * 1000
  const currencyData = data[baseCurrency] || {}

  if (typeof window !== "undefined") {
    localStorage.setItem(
      cacheKey,
      JSON.stringify({ data: currencyData, expiry })
    )
  } else {
    cache[cacheKey] = { data: currencyData, expiry }
  }

  return currencyData
}

export async function getConversionRate(
  baseCurrency: CurrencyUnit,
  targetCurrency: CurrencyUnit
): Promise<number> {
  const currencyData = await fetchCurrencyData(baseCurrency.toLowerCase())
  const rate = currencyData[targetCurrency.toLowerCase()]
  if (rate === undefined) {
    throw new Error(
      `Conversion rate from ${baseCurrency} to ${targetCurrency} not found`
    )
  }
  return rate
}
