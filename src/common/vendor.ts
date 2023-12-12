import Cars245 from "./cars245"
import type { PartDetail, PartNumber, PartsListing } from "./types"

export enum VendorType {
  Cars245
}

export interface SearchConfig {
  vendorType: VendorType
  partNumber: string
  searchUrl: URL
  fetchResult(): Promise<SearchResult>
}

export abstract class SearchConfig implements SearchConfig {
  searchUrl: URL

  constructor(partNumber: string, searchUrl: URL) {
    this.partNumber = partNumber
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
        result: await this.fetchPartsListing()
      }
    } catch (errorMsg) {
      return {
        success: false,
        errorMsg
      }
    }
  }

  /**
   * Fetches parts info from the vendor; errors can be thrown.
   */
  protected abstract fetchPartsListing(): Promise<PartsListing>
}

export interface SearchResult {
  success: boolean
  result?: PartsListing
  errorMsg?: string
}

export interface DetailResult {
  success: boolean
  result?: PartDetail
  errorMsg?: string
}

export interface Vendor {
  getVendorType(): VendorType
  getUrlBase(): string

  /**
   * @returns Preconfigured SearchConfig instance for this query and vendor
   * @param partNumber Part number to search for
   */
  getSearchConfig(partNumber: PartNumber): SearchConfig

  /**
   * Fetches PartDetail from a given part URL
   * @param partURL part URL to load
   */
  fetchPartDetail(partURL: URL): Promise<PartDetail>
}
