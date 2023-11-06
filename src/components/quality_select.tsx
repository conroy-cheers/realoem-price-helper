import { type FC } from "react"

import { QualityLevel } from "~common/types"
import { enumKeys } from "~common/util"

const qualitySelectOptions = enumKeys(QualityLevel).map((key) => {
  return {
    value: key as QualityLevel,
    label: key === QualityLevel.Unknown ? "All" : QualityLevel[key]
  }
})

type QualitySelectProps = {
  value: QualityLevel
  setValue: (QualityLevel) => any
  valuesDisabled?: QualityLevel[]
}

const QualitySelect: FC<QualitySelectProps> = ({
  value,
  setValue,
  valuesDisabled = []
}) => {
  const handleClick = (e) => {
    e.persist()
    e.nativeEvent.stopImmediatePropagation()
    e.stopPropagation()
  }

  const handleChange = (e) => {
    setValue(e.target.value)
  }

  return (
    <select
      className="bg-gray-50 border border-gray-500 rounded-sm"
      onClick={handleClick}
      onChange={handleChange}
      value={value}>
      {qualitySelectOptions.map(({ value, label }) => (
        <option
          key={value}
          value={value}
          disabled={valuesDisabled.includes(value)}>
          {label}
        </option>
      ))}
    </select>
  )
}

export default QualitySelect
