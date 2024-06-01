import { CurrencyUnit } from "~common/types"
import QualityFilterSelect from "~components/quality_filter_select"
import { PreferencesHook } from "~frontend/preferences_hook"

import CurrencyUnitSelect from "./currency_select"

const preferencesHook = new PreferencesHook()

const UserPreferencesConfigurator = ({}) => {
  const [qualityFilter, setQualityFilter] =
    preferencesHook.useQualityFilterStorage()
  const [preferredCurrency, setPreferredCurrency] =
    preferencesHook.usePreferredCurrencyStorage()

  return (
    <div className="grid grid-cols-2 gap-3 gap-y-5 pr-8 pt-2 pb-6">
      <span className="text-md">Preferred Quality</span>
      <QualityFilterSelect
        value={qualityFilter}
        setValue={setQualityFilter}
        large={true}
      />

      <span className="text-md">Preferred Currency</span>
      <CurrencyUnitSelect
        value={preferredCurrency}
        setValue={setPreferredCurrency}
        large={true}
      />
    </div>
  )
}

export default UserPreferencesConfigurator
