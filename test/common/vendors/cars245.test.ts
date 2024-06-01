import "isomorphic-fetch"

import { describe, it } from "@jest/globals"

import Cars245 from "~/common/vendors/cars245"
import { VendorType } from "~common/vendor"

import { validateSearchConfig, validateSearchResult } from "./verify"

const PART_NUMBER = "11428637821"

describe("test Cars245 search", () => {
  const cars245 = new Cars245()
  const sc = cars245.getSearchConfig(PART_NUMBER)

  validateSearchConfig(sc, VendorType.Cars245, PART_NUMBER)

  it("Fetch and validate result", async () => {
    const result = await sc.fetchResult()
    validateSearchResult(result)
  })
})
