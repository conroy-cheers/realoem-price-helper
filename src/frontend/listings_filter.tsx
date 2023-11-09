import { partsOrderedByPrice } from "~common/parts_listing"
import {
  partExceedsQualityFilter,
  partMatchesQualityFilter,
  QualityFilter
} from "~common/quality_filter"
import { type PartInfo, type PartsListing } from "~common/types"
import { enumKeys } from "~common/util"

export type FilteredParts = {
  exactMatches: PartInfo[]
  suggestedMatches: PartInfo[]
}

export function filterAndSortParts(
  listing: PartsListing,
  filter: QualityFilter
): FilteredParts {
  if (listing) {
    const exactMatches = listing.parts.filter((part) =>
      partMatchesQualityFilter(filter, part)
    )
    const exactMatchesMaxPrice = Math.max(
      ...exactMatches.map((p) => Number(p.price))
    )
    const exceedMatches = listing.parts.filter((part) =>
      partExceedsQualityFilter(filter, part)
    )
    const suggestedMatches = exceedMatches
      .filter((p) => Number(p.price) <= exactMatchesMaxPrice)
      .filter(
        (suggestedPart) =>
          !exactMatches.some((exactPart) => exactPart.url === suggestedPart.url)
      )
    return {
      exactMatches: partsOrderedByPrice(exactMatches),
      suggestedMatches: partsOrderedByPrice(suggestedMatches)
    }
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
