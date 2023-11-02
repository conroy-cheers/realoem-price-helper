import type { PartInfo, PartNumber } from "./types"

export enum VendorType {
  Cars245
}

export interface SearchConfig {
  vendorType: VendorType
  searchUrl: URL
  fetchResult(): Promise<SearchResult>
}

export abstract class SearchConfig implements SearchConfig {
  searchUrl: URL

  constructor(searchUrl: URL) {
    this.searchUrl = searchUrl
  }

  /**
   * @returns a SearchResult wrapping either successful search results,
   * or any thrown error during the search.
   */
  async fetchResult(): Promise<SearchResult> {
    try {
      return {
        success: true,
        result: await this.fetchPartInfo()
      }
    } catch (errorMsg) {
      return {
        success: false,
        errorMsg
      }
    }
  }

  /**
   * Fetches part info from the vendor; errors can be thrown.
   */
  protected abstract fetchPartInfo(): Promise<PartInfo>
}

export interface SearchResult {
  success: boolean
  result?: PartInfo
  errorMsg?: string
}

export interface Vendor {
  vendorType: VendorType

  /**
   * @returns Preconfigured SearchConfig instance for this query and vendor
   * @param partNumber Part number to search for
   */
  getSearchConfig(partNumber: PartNumber): SearchConfig
}
