import { useEffect, useState } from "react"

import BrandConfigReset from "~components/brand_config_reset"
import BrandConfigRow from "~components/brand_config_row"
import { BrandRegistryHook } from "~frontend/brand_registry_hook"

const brandRegistry = new BrandRegistryHook()

const BrandConfigurator = ({}) => {
  const [brandNames, setBrandNames] = useState([])

  useEffect(() => {
    // TODO handle brands added/removed
    brandRegistry.getAllBrands().then((data) => {
      setBrandNames(data.map((brand) => brand.name))
    })
  }, []) // the [] ensures this is only run once

  return (
    <div className="pb-12">
      <table className="border-collapse table-auto">
        <thead>
          <tr className="border-t border-b bg-slate-200">
            <th className="pl-4 pt-3 pb-1 text-left">Name</th>
            <th className="pr-4 pt-3 pb-1 text-left text-md">Quality</th>
          </tr>
        </thead>
        <tbody>
          {brandNames.map((brandName) => (
            <BrandConfigRow key={brandName} brandName={brandName} />
          ))}
        </tbody>
      </table>
      <div className="pt-2 px-3">
        <BrandConfigReset />
      </div>
    </div>
  )
}

export default BrandConfigurator
