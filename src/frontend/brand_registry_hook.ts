import { useStorage } from "@plasmohq/storage/hook"

import { BrandRegistry } from "~common/brand_registry"

export class BrandRegistryHook extends BrandRegistry {
  useBrandStorage(brandName: string) {
    return useStorage(
      { key: this.makeKey(brandName), instance: this.storage },
      (v) => (v === undefined ? { name: brandName, quality: 0 } : v)
    )
  }
}
