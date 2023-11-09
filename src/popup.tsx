import BrandConfigurator from "~components/brand_configurator"

import "./style.css"

import appIcon from "data-base64:~assets/icon.png"

import UserPreferencesConfigurator from "~components/user_preferences_configurator"

function IndexPopup() {
  return (
    <div className="w-[24rem] pt-4 px-2">
      <div className="bg-slate-600 -mt-4 -mx-2 mb-2">
        <div className="flex flex-row space-x-2">
          <img src={appIcon} className="w-24 h-24" />
          <div className="flex-grow flex flex-col justify-center items-center">
            <span className="align-middle text-xl font-bold text-white">
              RealOEM Price Helper
            </span>
          </div>
        </div>
      </div>
      <div>
        <span className="text-lg">Preferences</span>
        <UserPreferencesConfigurator />
      </div>
      <div>
        <span className="text-lg">Brand Configuration</span>
        <BrandConfigurator />
      </div>
    </div>
  )
}

export default IndexPopup
