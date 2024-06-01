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
import { getParts, type ErrorMsg } from "~frontend/get_parts"
import {
  filterAndSortParts,
  getBestImage,
  qualityFiltersUnavailable
} from "~frontend/listings_filter"

import PartFilterControl from "./part_filter_control"

const ShopDetail: FC<{
  partNumber: PartNumber
  initialQualityFilter: QualityFilter
}> = (props) => {
  const [partsListing, setPartsListing] = useState(null as PartsListing | null)
  const [errorMsg, setErrorMsg] = useState(null as ErrorMsg | null)
  const [selectedFilter, setSelectedFilter] = useState(
    props.initialQualityFilter
  )
  const [partImageURL, setPartImageURL] = useState("")
  const [loadingDone, setLoadingDone] = useState(false)

  function updatePartImageURL() {
    const partDetail = getBestImage(partsListing)
    if (partDetail) {
      setPartImageURL(partDetail.image.toString())
    }
  }

  const unavailableQualities = partsListing
    ? qualityFiltersUnavailable(partsListing)
    : []

  useEffect(() => {
    getParts(props.partNumber, setPartsListing, setErrorMsg, setLoadingDone)
  }, [])

  useEffect(() => {
    if (partsListing !== null) {
      if (partsListing && unavailableQualities.includes(selectedFilter)) {
        setSelectedFilter(QualityFilter.Any)
      } else {
        setSelectedFilter(props.initialQualityFilter)
      }

      partsListing.parts.forEach((element, index, array) => {
        const vendor = getVendor(new URL(element.url))
        if (vendor !== null) {
          getPartDetail(element).then((detail) => {
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
      <div className="w-80 h-80 border-gray-400">
        {loadingDone ? "" : <span>Loading...</span>}
        <img src={partImageURL.toString()} className="object-contain" />
        {loadingDone && !partImageURL ? <span>no image</span> : ""}
      </div>
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
      </div>
    </div>
  )
}

export default ShopDetail
