import { type FC } from "react"

import { CurrencyUnit } from "~common/types"

const qualitySelectOptions = Object.keys(CurrencyUnit)

type CurrencyUnitSelectProps = {
  value: CurrencyUnit
  setValue: (CurrencyUnit) => any
  large?: boolean
  annotations?: Map<CurrencyUnit, string>
}

function buildOption(option: string) {
  const currency = option as CurrencyUnit
  return (
    <option key={currency} value={option}>
      {option}
    </option>
  )
}

const CurrencyUnitSelect: FC<CurrencyUnitSelectProps> = ({
  value,
  setValue,
  large = false
}) => {
  const handleClick = (e) => {
    e.persist()
    e.nativeEvent.stopImmediatePropagation()
    e.stopPropagation()
  }

  const handleChange = (e) => {
    setValue(e.target.value)
  }

  const classes = "bg-gray-50 border border-gray-500 rounded-sm ".concat(
    large ? "h-8" : "h-[1.3em]"
  )

  return (
    <select
      className={classes}
      onClick={handleClick}
      onChange={handleChange}
      value={value}>
      {qualitySelectOptions.map((option) => buildOption(option))}
    </select>
  )
}

export default CurrencyUnitSelect
