import { type FC } from "react"

import { type PartInfo } from "~common/types"

const PartSummary: FC<{ part: PartInfo }> = (props) => {
  return (
    <div>
      <span>
        {props.part.brand.name}{" "}
        <a
          href={props.part.url.toString()}
          className="text-blue-600 hover:text-blue-800 visited:text-purple-600">
          ${props.part.price}
        </a>
      </span>
    </div>
  )
}

export default PartSummary
