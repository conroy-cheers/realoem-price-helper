function buildMsg(target, type, data) {
  return { target, type, data };
}

chrome.runtime.onMessage.addListener((message) => {
  // Return early if this message isn't meant for the offscreen document.
  if (message.target !== "offscreen") {
    return;
  }

  // Dispatch the message to an appropriate handler.
  switch (message.type) {
    case "parse-request":
      sendParseResult(handleParseRequest(message.data));
      return;
    default:
      console.warn(`Unexpected message type received: '${message.type}'.`);
      return;
  }
});

function handleParseRequest(request) {
  const {
    id,
    request: { provider, data },
  } = request;
  switch (provider) {
    case "cars245":
      return {
        id,
        result: parseSearchResultCars245(data),
      };
    default:
      throw Error('Unknown search provider "${provider}"');
  }
}

function partInfoData(url, partNumber, price, currency) {
  return {
    success: true,
    result: {
      url,
      partNumber,
      price,
      currency,
    },
  };
}

function errorData(message) {
  return { success: false, error: message };
}

function sendParseResult(data) {
  chrome.runtime.sendMessage({
    type: "parse-result",
    target: "background-parser",
    data,
  });
}

function parseSearchResultCars245(htmlString) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    const anchorElement = doc.querySelector(
      'a[data-js-click-event="clickProductCard"]'
    );

    if (anchorElement) {
      const anchorURL = new URL(anchorElement.href);
      const url = "https://cars245.com" + anchorURL.pathname;
      const sku = anchorElement.querySelector('span[itemprop="sku"]').innerText;
      const price = anchorElement.querySelector(
        'meta[itemprop="price"]'
      ).content;
      const currency = anchorElement.querySelector(
        'meta[itemprop="priceCurrency"]'
      ).content;
      return partInfoData(url, sku, price, currency);
    } else {
      return errorData("Product card not found");
    }
  } catch (error) {
    return errorData(`HTML parsing failed: ${error}`);
  }
}
