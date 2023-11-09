import { partsOrderedByPrice } from "~common/parts_listing"
import {
  partExceedsQualityFilter,
  partMatchesQualityFilter,
  QualityFilter
} from "~common/quality_filter"
import { type PartInfo, type PartsListing } from "~common/types"
import { enumKeys } from "~common/util"

export function filterAndSortParts(
  listing: PartsListing,
  filter: QualityFilter
): PartInfo[] {
  if (listing) {
    const exactMatches = listing.parts.filter((part) =>
      partMatchesQualityFilter(filter, part)
    )
    const exceedMatches = listing.parts.filter((part) =>
      partExceedsQualityFilter(filter, part)
    )
    return partsOrderedByPrice(exactMatches)
  }
}

export function exactMatchesPerFilter(
  listing: PartsListing
): Map<QualityFilter, number> {
  let matchesMap = new Map()
  for (const filter of enumKeys(QualityFilter)) {
    const exactMatches = listing.parts.filter((part) =>
      partMatchesQualityFilter(filter, part)
    )
    matchesMap.set(filter, exactMatches.length)
  }
  return matchesMap
}

export function qualityFiltersUnavailable(
  listing: PartsListing
): QualityFilter[] {
  const unavailableKeys = Array.from(exactMatchesPerFilter(listing).entries())
    .filter(([filter, count]) => count == 0)
    .map(([filter, count]) => filter)
  return unavailableKeys
}
