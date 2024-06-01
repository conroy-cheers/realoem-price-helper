import { sendToBackground } from "@plasmohq/messaging"

import type {
  PartNumber,
  PartsListing,
  SearchServiceRequest,
  SearchServiceResponse
} from "~common/types"
import type { SearchConfig } from "~common/vendor"

import { PreferencesHook } from "./preferences_hook"

export class SearchError extends Error {
  searchConfig: SearchConfig

  constructor(message: string, searchConfig: SearchConfig) {
    super(message)
    this.searchConfig = searchConfig
  }
}

export async function getPartsListing(
  partNumber: PartNumber
): Promise<PartsListing> {
  const prefsHook = new PreferencesHook()
  const preferredCurrency = (await prefsHook.getPrefs()).preferredCurrency

  const request: SearchServiceRequest = {
    partNumber,
    preferredCurrency
  }
  const response: SearchServiceResponse = await sendToBackground({
    name: "search",
    body: request
  })
  if (response) {
    if (response.combinedResult.success === true) {
      return response.combinedResult.result
    } else if (response.combinedResult.success === false) {
      // throw new SearchError(
      //   `Error fetching part info: ${response.combinedResult.errorMsg}`,
      //   response.config
      // )
    }
  } else {
    throw Error("Error fetching part info")
  }
}
