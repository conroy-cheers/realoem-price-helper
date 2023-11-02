import { Storage } from "@plasmohq/storage"

import { QualityLevel, type PartBrand } from "~common/types"

export class BrandRegistry {
  private storage: Storage

  constructor() {
    this.storage = new Storage({ area: "sync" })
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

  async registerBrand(brand: PartBrand) {
    await this.storage.set(this.makeKey(brand.name), brand)
  }

  private makeKey(brandString: string): string {
    return `brands-${brandString}`
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
