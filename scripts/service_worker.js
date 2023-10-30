import Cars245 from "../lib/cars245.js";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { type, target, data } = request;
  if (target !== "background") {
    return false;
  }
  switch (type) {
    case "fetch-price":
      fetchPrice(data.partNumber, sendResponse);
      break;
    default:
      console.warn(`Unknown message type for service_worker: "${type}"`);
      sendResponse({ success: false });
  }
  return true; // keeps connection open for async sendResponse() usage
});

async function fetchPrice(partNumber, sendResponse) {
  try {
    const partInfo = await Cars245.getPartInfo(partNumber);
    sendResponse(partInfo);
  } catch (err) {
    sendResponse({ success: false, error: err });
  }
}
