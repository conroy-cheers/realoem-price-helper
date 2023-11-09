import { useStorage } from "@plasmohq/storage/hook"

import { BrandRegistry } from "~common/brand_registry"
import { QualityLevel } from "~common/types"

export class BrandRegistryHook extends BrandRegistry {
  useBrandStorage(brandName: string) {
    return useStorage(
      { key: this.makeKey(brandName), instance: this.storage },
      { name: brandName, quality: QualityLevel.Unknown }
    )
  }
}
