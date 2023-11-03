import { Storage } from "@plasmohq/storage"

import { QualityLevel, type PartBrand } from "~common/types"

const KEY_PREFIX = "brands-"

export class BrandRegistry {
  protected storage: Storage

  constructor() {
    this.storage = new Storage({ area: "sync" })
  }

  async getAllBrands(): Promise<PartBrand[]> {
    const storageData = await this.storage.getAll()
    const brandKeys = Object.keys(storageData).filter((key) =>
      key.startsWith(KEY_PREFIX)
    )
    const brandValues = brandKeys.map((key) => JSON.parse(storageData[key]))
    return brandValues
  }

  async getBrand(brandName: string): Promise<PartBrand> {
    // TODO fuzzy key matching
    const brand: PartBrand = await this.storage.get(this.makeKey(brandName))
    if (brand) {
      return brand
    } else {
      const brand = {
        name: brandName,
        quality: this.getDefaultQuality(brandName)
      }
      await this.registerBrand(brand)
      return brand
    }
  }

  async deregisterAll() {
    const brands = await this.getAllBrands()
    for (const brand of brands) {
      await this.deregisterBrand(brand)
    }
  }

  async deregisterBrand(brand: PartBrand) {
    await this.storage.remove(this.makeKey(brand.name))
  }

  async registerBrand(brand: PartBrand) {
    await this.storage.set(this.makeKey(brand.name), brand)
  }

  protected makeKey(brandString: string): string {
    return `${KEY_PREFIX}${brandString.toUpperCase()}`
  }

  private getDefaultQuality(brandName: string): QualityLevel {
    switch (brandName) {
      case "BMW":
        return QualityLevel.Genuine
      default:
        return QualityLevel.Unknown
    }
  }
}
