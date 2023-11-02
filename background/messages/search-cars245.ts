import type { PlasmoMessaging } from "@plasmohq/messaging"

import Cars245 from "~common/cars245"
import type { PartSearchRequest, PartSearchResponse } from "~common/types"

type ReqType = PlasmoMessaging.Request<"search-cars245", PartSearchRequest>
type ResType = PlasmoMessaging.Response<PartSearchResponse>

const handler: PlasmoMessaging.MessageHandler = async (
  req: ReqType,
  res: ResType
) => {
  const cars245 = new Cars245()
  const searchConfig = cars245.getSearchConfig(req.body.partNumber)
  try {
    const partInfo = await searchConfig.fetchPartInfo()
    res.send({
      success: true,
      config: searchConfig,
      result: partInfo
    })
  } catch (error) {
    res.send({
      success: false,
      config: searchConfig,
      error: error.message
    })
  }
}

export default handler
