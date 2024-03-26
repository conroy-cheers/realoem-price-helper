import type { PlasmoMessaging } from "@plasmohq/messaging"

import { LocalCache } from "~common/cache"
import type { SearchServiceRequest, SearchServiceResponse } from "~common/types"
import Cars245 from "~common/vendors/cars245"
import RunAutoParts from "~common/vendors/runautoparts"

const cache = new LocalCache(1)

type ReqType = PlasmoMessaging.Request<"search", SearchServiceRequest>
type ResType = PlasmoMessaging.Response<SearchServiceResponse>

const handler: PlasmoMessaging.MessageHandler = async (
  req: ReqType,
  res: ResType
) => {
  // const cars245 = new Cars245()
  // const searchConfig = cars245.getSearchConfig(req.body.partNumber)
  // const runautoparts = new RunAutoParts()
  // const searchConfig = runautoparts.getSearchConfig(req.body.partNumber)
  const searchResult = await cache.fetchFor(searchConfig)
  res.send({
    config: searchConfig,
    result: searchResult
  })
}

export default handler
