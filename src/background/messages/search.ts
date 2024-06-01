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
import {
  VendorType,
  type FulfilledSearch,
  type SearchConfig,
  type SearchResult
} from "~common/vendor"
import RunAutoParts from "~common/vendors/runautoparts"
import Schmiedmann from "~common/vendors/schmiedmann"

const cache = new LocalCache(1)

type ReqType = PlasmoMessaging.Request<"search", SearchServiceRequest>
type ResType = PlasmoMessaging.Response<SearchServiceResponse>

function getSearchConfigForVendor(
  partNumber: string,
  vendor: VendorType
): SearchConfig {
  switch (vendor) {
    case VendorType.Cars245:
      return new Cars245().getSearchConfig(partNumber)
    case VendorType.RunAutoParts:
      return new RunAutoParts().getSearchConfig(partNumber)
    case VendorType.Schmiedmann:
      return new Schmiedmann().getSearchConfig(partNumber)
  }
}

const handler: PlasmoMessaging.MessageHandler = async (
  req: ReqType,
  res: ResType
) => {
  const config = getSearchConfigForVendor(req.body.partNumber, req.body.vendor)

  res.send({
    config,
    result: await cache.fetchFor(config)
  })
}

export default handler
