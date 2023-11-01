import type { PlasmoMessaging } from "@plasmohq/messaging"

import Cars245 from "~common/cars245"
import type { PartSearchRequest, PartSearchResponse } from "~common/types"

type ReqType = PlasmoMessaging.Request<"search-cars245", PartSearchRequest>
type ResType = PlasmoMessaging.Response<PartSearchResponse>

const handler: PlasmoMessaging.MessageHandler = async (
  req: ReqType,
  res: ResType
) => {
  try {
    const partInfo = await Cars245.getPartInfo(req.body.partNumber)
    res.send({
      success: true,
      result: partInfo
    })
  } catch (error) {
    res.send({
      success: false,
      error: error.message
    })
  }
}

export default handler
