import "isomorphic-fetch"

import { describe, it } from "@jest/globals"

import { VendorType } from "~common/vendor"
import RunAutoParts from "~common/vendors/runautoparts"

import { validateSearchConfig, validateSearchResult } from "./verify"

const PART_NUMBER = "34116855000"

describe("test Run Auto Parts search", () => {
  const runautoparts = new RunAutoParts()
  const sc = runautoparts.getSearchConfig(PART_NUMBER)

  validateSearchConfig(sc, VendorType.RunAutoParts, PART_NUMBER)

  it("Fetch and validate result", async () => {
    const result = await sc.fetchResult()
    validateSearchResult(result)
  })
})
