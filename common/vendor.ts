import type { PartInfo, PartNumber } from "./types"

export interface SearchConfig {
  searchUrl: URL
  fetchPartInfo(): Promise<PartInfo>
}

export interface Vendor {
  getSearchConfig(partNumber: PartNumber): SearchConfig
}
