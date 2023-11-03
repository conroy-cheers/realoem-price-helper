import { Storage } from "@plasmohq/storage"

import type { SearchConfig, SearchResult } from "./vendor"

type CachedSearchResult = {
  timeRetrieved: Date
  searchConfig: SearchConfig
  result: SearchResult
}

export class LocalCache {
  private expiryTimeMinutes: number
  private storage: Storage

  constructor(expiryTimeMinutes: number) {
    this.expiryTimeMinutes = expiryTimeMinutes
    this.storage = new Storage({ area: "local" })
  }

  async fetchFor(searchConfig: SearchConfig): Promise<SearchResult> {
    const cachedValue = await this.cacheGet(searchConfig)
    if (cachedValue && !isOutdated(cachedValue, this.expiryTimeMinutes)) {
      return cachedValue.result
    } else {
      const fetchedValue = await this.performFetch(searchConfig)
      this.cacheSet(searchConfig, fetchedValue)
      return fetchedValue.result
    }
  }

  private async cacheGet(
    searchConfig: SearchConfig
  ): Promise<CachedSearchResult> {
    return await this.storage.get(searchConfig.searchUrl.toString())
  }

  private async cacheSet(
    searchConfig: SearchConfig,
    searchResult: CachedSearchResult
  ) {
    await this.storage.set(searchConfig.searchUrl.toString(), searchResult)
  }

  private async performFetch(
    searchConfig: SearchConfig
  ): Promise<CachedSearchResult> {
    const result = await searchConfig.fetchResult()
    return {
      timeRetrieved: new Date(),
      searchConfig,
      result
    }
  }
}

function isOutdated(
  cachedResult: CachedSearchResult,
  expiryTimeMinutes: number = 1440
): boolean {
  const now = new Date()
  const cacheDate = new Date(cachedResult.timeRetrieved)
  const elapsedMillis = now.getTime() - cacheDate.getTime()
  const elapsedMinutes = elapsedMillis / 1000 / 60
  return elapsedMinutes > expiryTimeMinutes
}
