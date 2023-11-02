import type { PlasmoMessaging } from "@plasmohq/messaging"

import { LocalCache } from "~common/cache"
import Cars245 from "~common/cars245"
import type { SearchServiceRequest, SearchServiceResponse } from "~common/types"

const cache = new LocalCache(0)

type ReqType = PlasmoMessaging.Request<"search-cars245", SearchServiceRequest>
type ResType = PlasmoMessaging.Response<SearchServiceResponse>

const handler: PlasmoMessaging.MessageHandler = async (
  req: ReqType,
  res: ResType
) => {
  const cars245 = new Cars245()
  const searchConfig = cars245.getSearchConfig(req.body.partNumber)
  const searchResult = await cache.fetchFor(searchConfig)
  res.send({
    config: searchConfig,
    result: searchResult
  })
}

export default handler
