import type { PlasmoMessaging } from "@plasmohq/messaging"

import Cars245 from "~/common/vendors/cars245"
import { LocalCache } from "~common/cache"
import { getConversionRate } from "~common/currency_rates"
import {
  CurrencyUnit,
  type PartInfo,
  type SearchServiceRequest,
  type SearchServiceResponse
} from "~common/types"
import type {
  FulfilledSearch,
  SearchConfig,
  SearchResult
} from "~common/vendor"
import RunAutoParts from "~common/vendors/runautoparts"
import Schmiedmann from "~common/vendors/schmiedmann"

const cache = new LocalCache(1)

type ReqType = PlasmoMessaging.Request<"search", SearchServiceRequest>
type ResType = PlasmoMessaging.Response<SearchServiceResponse>

async function convertPartCurrency(
  part: PartInfo,
  targetCurrency: CurrencyUnit
): Promise<PartInfo> {
  const ratio = await getConversionRate(part.currency, targetCurrency)
  return {
    ...part,
    currency: targetCurrency,
    price: Math.round(part.price * ratio * 100) / 100
  }
}

async function mergeSearchResults(
  searchResults: SearchResult[],
  targetCurrency: CurrencyUnit
): Promise<SearchResult> {
  let parts = searchResults
    .filter((search) => search.result !== undefined)
    .flatMap((search) => search.result.parts)

  const currencyConvertedParts = await Promise.all(
    parts.map((part) => convertPartCurrency(part, targetCurrency))
  )

  return {
    success: true,
    result: {
      parts: currencyConvertedParts
    }
  }
}

const handler: PlasmoMessaging.MessageHandler = async (
  req: ReqType,
  res: ResType
) => {
  const searchConfigs = []
  searchConfigs.push(new Cars245().getSearchConfig(req.body.partNumber))
  searchConfigs.push(new RunAutoParts().getSearchConfig(req.body.partNumber))

  // const schmiedmann = new Schmiedmann()
  // const searchConfig = schmiedmann.getSearchConfig(req.body.partNumber)

  const resultPromises: Promise<FulfilledSearch>[] = searchConfigs.map(
    async (searchConfig) => {
      return {
        searchConfig: searchConfig,
        searchResult: await cache.fetchFor(searchConfig)
      }
    }
  )
  const searchResults = await Promise.all(resultPromises)

  let combinedResult = {
    vendorResults: searchResults,
    combinedResult: await mergeSearchResults(
      searchResults.map((search) => search.searchResult),
      req.body.preferredCurrency
    )
  }
  console.warn(combinedResult)
  res.send(combinedResult)
}

export default handler
