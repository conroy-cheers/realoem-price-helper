import { describe, expect, it } from "@jest/globals"

import { getConversionRate } from "~common/currency_rates"
import { CurrencyUnit } from "~common/types"

describe("test currency_rates", () => {
  it("Test aud-eur pair", async () => {
    const fetchedRate = await getConversionRate(
      CurrencyUnit.AUD,
      CurrencyUnit.EUR
    )
    expect(fetchedRate > 0 && fetchedRate < 1)
  })

  it("Test inverse", async () => {
    const rate1 = await getConversionRate(CurrencyUnit.AUD, CurrencyUnit.EUR)
    const rate2 = await getConversionRate(CurrencyUnit.EUR, CurrencyUnit.AUD)
    expect(1.0 / rate1 === rate2)
  })
})
