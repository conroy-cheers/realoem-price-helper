import { mergePartsListings } from "~common/part_search"
import type { PartNumber, PartsListing, Setter } from "~common/types"
import { VendorType } from "~common/vendor"

import { PreferencesHook } from "./preferences_hook"
import { getPartsListing, SearchError } from "./search"

export type ErrorMsg = { msg: string; partNumber: string }

export async function getParts(
  partNumber: PartNumber,
  setPartsListing: Setter<PartsListing>,
  setErrorMsg: Setter<ErrorMsg>,
  setLoadingDone: Setter<boolean>
) {
  const prefsHook = new PreferencesHook()
  const preferredCurrency = (await prefsHook.getPrefs()).preferredCurrency

  const searchVendors = [
    VendorType.Cars245,
    VendorType.RunAutoParts,
    VendorType.Schmiedmann
  ]
  let vendorsDone = 0

  let searchResults: PartsListing[] = []
  searchVendors.map(async (vendor) => {
    try {
      let newListing = await getPartsListing(partNumber, vendor)
      searchResults.push(newListing)
      console.log(searchResults)
      setPartsListing(
        await mergePartsListings(searchResults, preferredCurrency)
      )
    } catch (err) {
      if (searchResults.length === 0) {
        if (err instanceof SearchError) {
          setErrorMsg({
            msg: "Not found",
            partNumber: err.searchConfig.partNumber
          })
        } else {
          setErrorMsg({
            msg: "Error",
            partNumber: null
          })
        }
      }
    } finally {
      vendorsDone++
      if (vendorsDone == searchVendors.length) {
        setLoadingDone(true)
      }
    }
  })
}
