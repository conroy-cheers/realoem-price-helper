import { useEffect, useState, type FC } from "react"

import { QualityFilter } from "~common/quality_filter"
import { type PartNumber, type PartsListing } from "~common/types"
import CompactPartsDisplay from "~components/compact_parts_display"
import LoadError from "~components/load_error"
import PartFilterControl from "~components/part_filter_control"
import { getParts } from "~frontend/get_parts"

import {
  filterAndSortParts,
  qualityFiltersUnavailable
} from "../frontend/listings_filter"

const ShopInline: FC<{
  partNumber: PartNumber
  initialQualityFilter: QualityFilter
}> = (props) => {
  const [partsListing, setPartsListing] = useState(null as PartsListing | null)
  const [errorMsg, setErrorMsg] = useState(
    null as { msg: string; url: URL } | null
  )
  const [selectedFilter, setSelectedFilter] = useState(
    props.initialQualityFilter
  )

  const unavailableQualities = partsListing
    ? qualityFiltersUnavailable(partsListing)
    : []

  useEffect(() => {
    getParts(props.partNumber, setPartsListing, setErrorMsg)
  }, [])

  useEffect(() => {
    if (partsListing !== null) {
      if (partsListing && unavailableQualities.includes(selectedFilter)) {
        setSelectedFilter(QualityFilter.Any)
      }
    }
  }, [partsListing])

  if (errorMsg) {
    return <LoadError error={errorMsg} />
  }

  if (partsListing) {
    const { exactMatches, suggestedMatches } = filterAndSortParts(
      partsListing,
      selectedFilter
    )

    return (
      <div className="flex flex-row space-x-2">
        <div>
          <PartFilterControl
            listing={partsListing}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            large={false}
          />
        </div>
        <CompactPartsDisplay parts={exactMatches} />
      </div>
    )
  }
}

export default ShopInline
