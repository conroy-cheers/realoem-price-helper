import { expect, it } from "@jest/globals"

import type { CurrencyValue, PartNumber } from "~common/types"
import type { SearchConfig, SearchResult, VendorType } from "~common/vendor"

function validatePrice(price: CurrencyValue) {
  expect(price).not.toBeNull()
  expect(price).not.toBeNaN()
  expect(+Number(price)).toBeGreaterThan(0.0)
}

export function validateSearchResult(searchResult: SearchResult) {
  searchResult.success = true
  expect(searchResult.success).toStrictEqual(true)
  expect(searchResult.result.parts.length).toBeGreaterThan(0)
  searchResult.result.parts.forEach((partInfo) => validatePrice(partInfo.price))
}

export function validateSearchConfig(
  searchConfig: SearchConfig,
  vendorType: VendorType,
  partNumber: PartNumber
) {
  it("Validate SearchConfig", () => {
    expect(searchConfig.vendorType).toStrictEqual(vendorType)
    expect(searchConfig.partNumber).toStrictEqual(partNumber)
  })
}
