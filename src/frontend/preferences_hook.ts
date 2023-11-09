import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { QualityLevel, type Preferences } from "~common/types"

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
      globalPreferredQuality: QualityLevel.Unknown
    } as Preferences)
  }

  useQualityLevelStorage(): readonly [QualityLevel, (QualityLevel) => void] {
    const [prefs, setPrefs] = this.usePrefsStorage()
    const globalPreferredQuality = prefs.globalPreferredQuality
    const qualitySetter = (globalPreferredQuality) => {
      setPrefs({ ...prefs, globalPreferredQuality })
    }
    return [globalPreferredQuality, qualitySetter]
  }
}
