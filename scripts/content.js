function getTableBody() {
  return document.querySelector("#partsList > tbody");
}

function getTableRows() {
  return document.querySelectorAll("#partsList > tbody > tr:not(:first-child)");
}

function extendTableHeader() {
  const headerRow = getTableBody().firstChild;
  if (headerRow) {
    const headerNode = document.createElement("th");
    const textNode = document.createTextNode("Shop");
    headerNode.appendChild(textNode);
    headerNode.className = "c0";
    headerRow.appendChild(headerNode);
  }
}

function getPartNumber(tableRow) {
  const partAnchor = tableRow.querySelector(
    ':scope > td > a[href^="/bmw/enUS/part?"]'
  );
  if (partAnchor) {
    return partAnchor.textContent;
  } else {
    return null;
  }
}

function extendTableRows() {
  let partRows = [];
  getTableRows().forEach((tableRow) => {
    const cellNode = document.createElement("td");
    tableRow.appendChild(cellNode);

    if ((partNumber = getPartNumber(tableRow))) {
      partRows.push({
        partNumber,
        infoCell: cellNode,
      });
    }
  });
  return partRows;
}

async function getPartInfo(partNumber) {
  const response = await chrome.runtime.sendMessage({
    type: "fetch-price",
    target: "background",
    data: {
      partNumber,
    },
  });
  if (response) {
    if (response.success === true) {
      return response.result;
    } else {
      return `Error fetching part info: ${response.error}`;
    }
  } else {
    return "Error fetching part info";
  }
}

function createLinkNode(partInfo) {
  const { url, currency, partNumber, price } = partInfo;
  const node = document.createElement("a");
  node.href = url;
  node.textContent = `$${price}`;
  return node;
}

async function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

extendTableHeader();
let partRows = extendTableRows();
partRows.forEach(async (partRow, i) => {
  // TODO fix this properly
  await delay(250 * i);

  const textNode = document.createTextNode("Loading...");
  partRow.infoCell.appendChild(textNode);

  const partInfo = await getPartInfo(partRow.partNumber);
  partRow.infoCell.appendChild(createLinkNode(partInfo));
  textNode.remove();
});
