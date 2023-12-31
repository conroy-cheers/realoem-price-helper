import { useEffect, useState, type FC } from "react"

import { QualityFilter } from "~common/quality_filter"
import {
  type PartInfo,
  type PartNumber,
  type PartsListing
} from "~common/types"
import { getVendor } from "~common/vendors"
import CompactPartsDisplay from "~components/compact_parts_display"
import LoadError from "~components/load_error"
import { getPartDetail } from "~frontend/detail"
import { getParts } from "~frontend/get_parts"
import {
  filterAndSortParts,
  qualityFiltersUnavailable
} from "~frontend/listings_filter"

import PartFilterControl from "./part_filter_control"

const ShopDetail: FC<{
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
  const [partImageURL, setPartImageURL] = useState("")

  function updatePartImageURL() {
    const imageURLs = partsListing.parts
      .filter((part) => part.detail != null && part.detail.image != null)
      .map((part) => part.detail.image)
    if (imageURLs.length > 0) {
      setPartImageURL(imageURLs[0].toString())
    }
  }

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

      partsListing.parts.forEach((element, index, array) => {
        const vendor = getVendor(new URL(element.url))
        if (vendor !== null) {
          getPartDetail(element.url).then((detail) => {
            array[index].detail = detail
            updatePartImageURL()
          })
        }
      })
    }
  }, [partsListing])

  let exactMatches: PartInfo[] = []
  let suggestedMatches: PartInfo[] = []
  if (partsListing) {
    const { exactMatches: exact, suggestedMatches: suggested } =
      filterAndSortParts(partsListing, selectedFilter)
    exactMatches = exact
    suggestedMatches = suggested
  }

  return (
    <div className="bg-slate-100 border border-slate-500 rounded-md pt-2 pb-4 px-4">
      <span className="block text-lg font-semibold">Shop</span>
      {errorMsg ? <LoadError error={errorMsg} /> : ""}
      <div className="flex flex-row space-x-2">
        <div>
          <span className="block">Quality: </span>
          <PartFilterControl
            listing={partsListing}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            large={true}
          />
        </div>
        <div>
          Results:
          <CompactPartsDisplay parts={exactMatches} />
        </div>
        <div>
          Suggested:
          <CompactPartsDisplay parts={suggestedMatches} />
        </div>
        <img src={partImageURL.toString()} />
      </div>
    </div>
  )
}

export default ShopDetail
