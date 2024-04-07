import { sendToBackground } from "@plasmohq/messaging"

import type {
  DetailServiceRequest,
  DetailServiceResponse,
  PartDetail,
  PartInfo
} from "~common/types"

export async function getPartDetail(part: PartInfo): Promise<PartDetail> {
  const request: DetailServiceRequest = {
    partIdentifier: {
      vendor: part.vendor,
      url: part.url,
      id: part.sku
    }
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
