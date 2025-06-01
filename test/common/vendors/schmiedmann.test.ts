import "isomorphic-fetch"

import { describe, it } from "@jest/globals"

import { VendorType } from "~common/vendor"
import Schmiedmann from "~common/vendors/schmiedmann"

import { validateSearchConfig, validateSearchResult } from "./verify"

const PART_NUMBER = "11428637821"
const GENUINE_ONLY_PART_NUMBER = "11137553165"

describe("test Schmiedmann search", () => {
  const schmiedmann = new Schmiedmann()
  const sc = schmiedmann.getSearchConfig(PART_NUMBER)

  validateSearchConfig(sc, VendorType.Schmiedmann, PART_NUMBER)

  it("Fetch and validate result", async () => {
    const result = await sc.fetchResult()
    validateSearchResult(result)
  }, 8000)
})

describe("test Schmiedmann search with genuine-only part", () => {
  const schmiedmann = new Schmiedmann()
  const sc = schmiedmann.getSearchConfig(GENUINE_ONLY_PART_NUMBER)

  validateSearchConfig(sc, VendorType.Schmiedmann, GENUINE_ONLY_PART_NUMBER)

  it("Fetch and validate result", async () => {
    const result = await sc.fetchResult()
    validateSearchResult(result)
  }, 8000)
})
