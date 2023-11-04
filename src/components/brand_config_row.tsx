import Select from "react-select"

import { QualityLevel, type PartBrand } from "~common/types"
import { enumKeys } from "~common/util"
import { BrandRegistryHook } from "~frontend/brand_registry_hook"

const brandRegistry = new BrandRegistryHook()

type BrandConfigProps = {
  brandName: string
}

const qualitySelectOptions = enumKeys(QualityLevel).map((key) => {
  return { value: key as QualityLevel, label: QualityLevel[key] }
})

const selectCustomStyles = {
  input: (provided, state) => ({
    ...provided,
    width: 100,
    height: 22,
    display: "flex",
    alignItems: "center"
  }),
  singleValue: (provided, state) => ({
    ...provided,
    marginTop: 2
  })
}

const BrandConfigRow = (props: BrandConfigProps) => {
  const [brand, setBrand] = brandRegistry.useBrandStorage(props.brandName)

  function handleQualityChange(option) {
    let updatedBrand: PartBrand = {
      ...brand,
      quality: option.value
    }
    setBrand(updatedBrand)
  }

  return (
    <tr className="border-t border-b">
      <td className="py-1 pl-4 pr-2">{brand.name}</td>
      <td className="py-1 pr-4">
        <Select
          options={qualitySelectOptions}
          styles={selectCustomStyles}
          value={qualitySelectOptions[brand.quality]}
          onChange={handleQualityChange}
        />
      </td>
    </tr>
  )
}

export default BrandConfigRow
