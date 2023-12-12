import { sendToBackground } from "@plasmohq/messaging"

import type {
  DetailServiceRequest,
  DetailServiceResponse,
  PartDetail,
  PartNumber,
  PartsListing,
  SearchServiceRequest,
  SearchServiceResponse
} from "~common/types"
import type { SearchConfig } from "~common/vendor"

export async function getPartDetail(partURL: URL): Promise<PartDetail> {
  const request: DetailServiceRequest = {
    partURL
  }
  const response: DetailServiceResponse = await sendToBackground({
    name: "detail-cars245",
    body: request
  })
  if (response) {
    if (response.result.success === true) {
      return response.result.result
    } else if (response.result.success === false) {
      throw new Error(`Error fetching part detail: ${response.result.errorMsg}`)
    }
  } else {
    throw Error("Error fetching part detail")
  }
}
