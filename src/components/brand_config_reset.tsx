import { useState } from "react"

import { BrandRegistry } from "~common/brand_registry"

const buttonClasses = "text-white font-bold py-2 px-4 border rounded"
const redButtonClasses =
  "bg-red-500 hover:bg-red-700 border-red-700 " + buttonClasses
const grayButtonClasses =
  "bg-gray-500 hover:bg-gray-700 border-gray-700 " + buttonClasses

const brandRegistry = new BrandRegistry()

const BrandConfigReset = ({}) => {
  const [dangerOpen, setDangerOpen] = useState(false)

  return (
    <div className="flex flex-row">
      <button
        className={
          "w-20 " + (dangerOpen ? grayButtonClasses : redButtonClasses)
        }
        onClick={() => setDangerOpen(!dangerOpen)}>
        {dangerOpen ? "Cancel" : "Reset"}
      </button>
      {dangerOpen ? (
        <div className="flex flex-row">
          <div className="flex-grow flex flex-col justify-center items-center">
            <span className="align-middle text-md px-3">Are you sure?</span>
          </div>
          <button
            className={redButtonClasses}
            onClick={() => {
              brandRegistry.deregisterAll()
              setDangerOpen(false)
            }}>
            Delete all brands!
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default BrandConfigReset
