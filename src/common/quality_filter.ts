import { QualityLevel, type PartInfo } from "./types"

export enum QualityFilter {
  Any = 0,
  Genuine = 1,
  OE = 2,
  Premium = 3,
  Midrange = 4,
  Budget = 5
}

export function matchingQuality(filter: QualityFilter): QualityLevel {
  switch (filter) {
    case QualityFilter.Any:
      return QualityLevel.Unknown
    case QualityFilter.Genuine:
      return QualityLevel.Genuine
    case QualityFilter.OE:
      return QualityLevel.OE
    case QualityFilter.Premium:
      return QualityLevel.Premium
    case QualityFilter.Midrange:
      return QualityLevel.Midrange
    case QualityFilter.Budget:
      return QualityLevel.Budget
    default:
      return QualityLevel.Unknown
  }
}

export function partMatchesQualityFilter(
  filter: QualityFilter,
  part: PartInfo
): boolean {
  const partQuality = part.brand.quality
  if (filter == QualityFilter.Any) {
    return true
  } else {
    return partQuality == matchingQuality(filter)
  }
}

export function partExceedsQualityFilter(
  filter: QualityFilter,
  part: PartInfo
): boolean {
  const partQuality = part.brand.quality

  if (partQuality == QualityLevel.Unknown) {
    // Unknown part quality should only be accepted with filter Any.
    return filter == QualityFilter.Any
  }

  switch (filter) {
    case QualityFilter.Any:
      return true
    case QualityFilter.Genuine:
      return partQuality <= QualityLevel.Genuine
    case QualityFilter.OE:
      return partQuality <= QualityLevel.OE
    case QualityFilter.Premium:
      return partQuality <= QualityLevel.Premium
    case QualityFilter.Midrange:
      return partQuality <= QualityLevel.Midrange
    case QualityFilter.Budget:
      return partQuality <= QualityLevel.Budget
    default:
      // this should never happen (tm), but just in case
      return false
  }
}
