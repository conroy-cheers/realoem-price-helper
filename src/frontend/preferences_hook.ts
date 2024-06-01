import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { QualityFilter } from "~common/quality_filter"
import { CurrencyUnit, QualityLevel, type Preferences } from "~common/types"

const PREFS_KEY = "realoem-price-helper-preferences"

export class PreferencesHook {
  private storage: Storage

  constructor() {
    this.storage = new Storage({ area: "sync" })
  }

  async getPrefs(): Promise<Preferences> {
    return await this.storage.get(PREFS_KEY)
  }

  usePrefsStorage() {
    return useStorage<Preferences>({ key: PREFS_KEY, instance: this.storage }, {
      globalPreferredQuality: QualityFilter.Any
    } as Preferences)
  }

  useQualityFilterStorage(): readonly [QualityFilter, (QualityFilter) => void] {
    const [prefs, setPrefs] = this.usePrefsStorage()
    const globalQualityFilter = prefs.globalPreferredQuality
    const qualityFilterSetter = (globalPreferredQuality) => {
      setPrefs({ ...prefs, globalPreferredQuality })
    }
    return [globalQualityFilter, qualityFilterSetter]
  }

  usePreferredCurrencyStorage(): readonly [
    CurrencyUnit,
    (CurrencyUnit) => void
  ] {
    const [prefs, setPrefs] = this.usePrefsStorage()
    const preferredCurrency = prefs.preferredCurrency
    const preferredCurrencySetter = (preferredCurrency) => {
      setPrefs({ ...prefs, preferredCurrency })
    }
    return [preferredCurrency, preferredCurrencySetter]
  }
}
