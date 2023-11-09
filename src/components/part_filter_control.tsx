import type { FC } from "react"

import type { QualityFilter } from "~common/quality_filter"
import type { PartsListing, Setter } from "~common/types"
import QualityFilterSelect from "~components/quality_filter_select"
import {
  exactMatchesPerFilter,
  qualityFiltersUnavailable
} from "~frontend/listings_filter"

const PartFilterControl: FC<{
  listing: PartsListing
  selectedFilter: QualityFilter
  setSelectedFilter: Setter<QualityFilter>
  large: boolean
}> = (props) => {
  let availableMatchesStrings = new Map()
  if (props.listing) {
    const availableMatches = exactMatchesPerFilter(props.listing)
    availableMatches.forEach((v, k) => {
      availableMatchesStrings.set(k, v.toString())
    })
  }

  const unavailableQualities = props.listing
    ? qualityFiltersUnavailable(props.listing)
    : []

  return (
    <QualityFilterSelect
      value={props.selectedFilter}
      setValue={props.setSelectedFilter}
      valuesDisabled={unavailableQualities}
      annotations={availableMatchesStrings}
      large={props.large}
    />
  )
}

export default PartFilterControl
