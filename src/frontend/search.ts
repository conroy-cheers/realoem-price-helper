import { sendToBackground } from "@plasmohq/messaging"

import type {
  PartNumber,
  PartsListing,
  SearchServiceRequest,
  SearchServiceResponse
} from "~common/types"
import { VendorType, type SearchConfig, type Vendor } from "~common/vendor"

import { PreferencesHook } from "./preferences_hook"

export class SearchError extends Error {
  searchConfig: SearchConfig

  constructor(message: string, searchConfig: SearchConfig) {
    super(message)
    this.searchConfig = searchConfig
  }
}

export async function getPartsListing(
  partNumber: PartNumber,
  vendorType: VendorType
): Promise<PartsListing> {
  const request: SearchServiceRequest = { partNumber, vendor: vendorType }

  const response: SearchServiceResponse = await sendToBackground({
    name: "search",
    body: request
  })
  if (response) {
    if (response.result.success === true) {
      return response.result.result
    } else if (response.result.success === false) {
      throw new SearchError(
        `Error fetching part info: ${response.result.errorMsg}`,
        response.config
      )
    }
  } else {
    throw Error("Error fetching part info")
  }
}
