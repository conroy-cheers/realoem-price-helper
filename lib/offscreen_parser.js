import buildMsg from "/lib/util.js";

const OFFSCREEN_DOCUMENT_PATH = "/offscreen/offscreen.html";

const parseRequests = new Map();

async function sendMessageToOffscreenDocument(type, data) {
  // Create an offscreen document if one doesn't exist yet
  if (!(await hasDocument())) {
    await chrome.offscreen.createDocument({
      url: OFFSCREEN_DOCUMENT_PATH,
      reasons: [chrome.offscreen.Reason.DOM_PARSER],
      justification: "Parse DOM for search results",
    });
  }
  // Now that we have an offscreen document, we can dispatch the message.
  chrome.runtime.sendMessage(buildMsg("offscreen", type, data));
}

// This function performs basic filtering and error checking on messages before
// dispatching the message to a more specific message handler.
chrome.runtime.onMessage.addListener((message) => {
  if (message.target !== "background-parser") {
    return;
  }

  // Dispatch the message to an appropriate handler.
  switch (message.type) {
    case "parse-result":
      const data = message.data;
      handleSearchResultsParseResult(data.id, data.result);
      closeOffscreenDocument();
      break;
    default:
      console.warn(`Unexpected message type received: '${message.type}'.`);
  }
});

async function handleSearchResultsParseResult(id, result) {
  const resolve = parseRequests.get(id);
  if (resolve) {
    await resolve(result);
    parseRequests.delete(id);
  }
}

async function closeOffscreenDocument() {
  if (!(await hasDocument())) {
    return;
  }
  await chrome.offscreen.closeDocument();
}

async function hasDocument() {
  // Check all windows controlled by the service worker if one of them is the offscreen document
  const offscreenDocPathTail = OFFSCREEN_DOCUMENT_PATH.split("/").pop();
  const matchedClients = await clients.matchAll();
  for (const client of matchedClients) {
    if (client.url.endsWith(offscreenDocPathTail)) {
      return true;
    }
  }
  return false;
}

export default function parseSearchResult(provider, htmlText) {
  const requestData = {
    id: crypto.randomUUID(),
    request: {
      provider,
      data: htmlText,
    },
  };
  return new Promise((resolve, reject) => {
    // Store the resolve function in the promises map, so it can be resolved upon response arriving
    parseRequests.set(requestData.id, resolve);
    sendMessageToOffscreenDocument("parse-request", requestData);
  });
}
