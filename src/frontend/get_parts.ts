import type { PartNumber, PartsListing, Setter } from "~common/types"

import { getPartsListing, SearchError } from "./search"

export type ErrorMsg = { msg: string; partNumber: string }

export async function getParts(
  partNumber: PartNumber,
  setPartsListing: Setter<PartsListing>,
  setErrorMsg: Setter<ErrorMsg>
) {
  try {
    const partsListing = await getPartsListing(partNumber)
    setPartsListing(partsListing)
  } catch (err) {
    if (err instanceof SearchError) {
      setErrorMsg({ msg: "Not found", partNumber: err.searchConfig.partNumber })
    } else setErrorMsg({ msg: "Error", partNumber: null })
  }
}
