import React, { useEffect, useState } from "react"

import BrandConfigRow from "~components/brand_config_row"
import { PreferencesHook } from "~frontend/preferences_hook"

import BrandConfigReset from "./brand_config_reset"
import QualitySelect from "./quality_select"

const preferencesHook = new PreferencesHook()

const UserPreferencesConfigurator = ({}) => {
  const [qualityLevel, setQualityLevel] =
    preferencesHook.useQualityLevelStorage()

  return (
    <div className="grid grid-cols-2 gap-3 gap-y-5 pr-8 pt-2 pb-6">
      <span className="text-md">Preferred Quality</span>
      <QualitySelect value={qualityLevel} setValue={setQualityLevel} />
    </div>
  )
}

export default UserPreferencesConfigurator
