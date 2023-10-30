import parseSearchResult from "./offscreen_parser.js";

export const URL_BASE = "https://cars245.com";

export default class Cars245 {
  static buildQueryURL(partNumber) {
    const searchURL = "https://cars245.com/en/catalog/";
    let params = new URLSearchParams();
    params.append("q", partNumber);
    return searchURL + "?" + params.toString();
  }

  static async getPartInfo(partNumber) {
    const response = await fetch(this.buildQueryURL(partNumber));
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    return await parseSearchResult("cars245", await response.text());
  }
}
