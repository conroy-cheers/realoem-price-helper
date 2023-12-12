import Cars245 from "./cars245"
import type { Vendor } from "./vendor"

/**
 *
 * @param url Any URL matching a supported vendor's BASE_URL
 */
export function getVendor(queryURL: URL): Vendor | null {
  const vendors = [Cars245]

  for (const V of vendors) {
    const vendor = new V()
    const queryDomain = queryURL.hostname
    const vendorDomain = new URL(vendor.getUrlBase()).hostname
    if (queryDomain === vendorDomain) {
      return vendor
    }
  }

  return null
}
