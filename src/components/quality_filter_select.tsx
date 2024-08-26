import { type FC } from "react"

import { QualityFilter } from "~common/quality_filter"
import { enumKeys } from "~common/util"

const qualitySelectOptions = enumKeys(QualityFilter).map((key) => {
  return {
    value: key as QualityFilter,
    label: QualityFilter[key]
  }
})

type QualityFilterSelectProps = {
  value: QualityFilter
  setValue: (QualityFilter) => any
  valuesDisabled?: QualityFilter[]
  large?: boolean
  annotations?: Map<QualityFilter, string>
}

function buildOption(
  optionData: { value: QualityFilter; label: string },
  valuesDisabled: QualityFilter[],
  annotation: string
) {
  const optionText = annotation
    ? `${optionData.label} (${annotation})`
    : optionData.label
  return (
    <option
      key={optionData.value}
      value={optionData.value}
      disabled={valuesDisabled.includes(optionData.value)}>
      {optionText}
    </option>
  )
}

const QualityFilterSelect: FC<QualityFilterSelectProps> = ({
  value,
  setValue,
  valuesDisabled = [],
  large = false,
  annotations = new Map()
}) => {
  const handleClick = (e) => {
    e.persist()
    e.nativeEvent.stopImmediatePropagation()
    e.stopPropagation()
  }

  const handleChange = (e) => {
    setValue(Number(e.target.value))
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
      {qualitySelectOptions.map((optionData) =>
        buildOption(
          optionData,
          valuesDisabled,
          annotations.get(optionData.value)
        )
      )}
    </select>
  )
}

export default QualityFilterSelect
