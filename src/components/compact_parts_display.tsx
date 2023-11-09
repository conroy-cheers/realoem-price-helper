import { type FC } from "react"

import { type PartInfo } from "~common/types"
import { partInfoKey } from "~common/util"
import PartSummary from "~components/part_summary"

const CompactPartsDisplay: FC<{
  parts: PartInfo[]
}> = (props) => {
  if (props.parts) {
    return (
      <div className="whitespace-nowrap">
        {props.parts.map((part) => (
          <PartSummary key={partInfoKey(part)} part={part}></PartSummary>
        ))}
      </div>
    )
  } else {
    return <span>Loading...</span>
  }
}

export default CompactPartsDisplay
