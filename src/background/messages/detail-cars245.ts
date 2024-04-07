import type { PlasmoMessaging } from "@plasmohq/messaging"

import { LocalCache } from "~common/cache"
import type { DetailServiceRequest, DetailServiceResponse } from "~common/types"
import Cars245 from "~common/vendors/cars245"

type ReqType = PlasmoMessaging.Request<"search", DetailServiceRequest>
type ResType = PlasmoMessaging.Response<DetailServiceResponse>

const handler: PlasmoMessaging.MessageHandler = async (
  req: ReqType,
  res: ResType
) => {
  const cars245 = new Cars245()
  try {
    const detailResult = await cars245.fetchPartDetail(req.body.partIdentifier)
    res.send({
      result: {
        success: true,
        result: detailResult
      }
    })
  } catch (err) {
    res.send({
      result: {
        success: false,
        errorMsg: err
      }
    })
  }
}

export default handler
