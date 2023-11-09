import styleText from "data-text:../style.css"
import type {
  PlasmoCSConfig,
  PlasmoCSUIJSXContainer,
  PlasmoGetInlineAnchorList,
  PlasmoGetShadowHostId,
  PlasmoGetStyle,
  PlasmoRender
} from "plasmo"
import { createRoot } from "react-dom/client"

import type { QualityFilter } from "~common/quality_filter"
import { type PartNumber } from "~common/types"
import ShopInline from "~components/shop_inline"
import { PreferencesHook } from "~frontend/preferences_hook"

function getTableBody() {
  return document.querySelector("#partsList > tbody")
}

function getTableRows() {
  return document.querySelectorAll("#partsList > tbody > tr:not(:first-child)")
}

function extendTableHeader() {
  const headerRow = getTableBody().firstChild
  if (headerRow) {
    const headerNode = document.createElement("th")
    const textNode = document.createTextNode("Shop")
    headerNode.appendChild(textNode)
    headerNode.className = "c0"
    headerRow.appendChild(headerNode)
  }
}

function getPartNumber(tableRow: Element): PartNumber | undefined {
  const partAnchor = tableRow.querySelector(
    ':scope > td > a[href^="/bmw/enUS/part?"]'
  )
  if (partAnchor) {
    return partAnchor.textContent
  }
}

function makeAnchor(partNumber: string): HTMLDivElement {
  const newDiv = document.createElement("div")
  newDiv.className = "price-helper-part-row-anchor"
  newDiv.setAttribute("data-price-helper-part-number", partNumber)
  return newDiv
}

function extendTableRows() {
  getTableRows().forEach((tableRow) => {
    const cellNode = document.createElement("td")
    tableRow.appendChild(cellNode)

    const partNumber = getPartNumber(tableRow)
    if (partNumber) {
      // make anchor and return
      cellNode.appendChild(makeAnchor(partNumber))
    }
  })
}

extendTableHeader()
extendTableRows()
const prefsHook = new PreferencesHook()

export const config: PlasmoCSConfig = {
  matches: ["https://www.realoem.com/bmw/enUS/showparts*"]
}

export const getInlineAnchorList: PlasmoGetInlineAnchorList = async () => {
  return document.querySelectorAll("div.price-helper-part-row-anchor")
}

export const getShadowHostId: PlasmoGetShadowHostId = ({ element }) =>
  "price-helper-part-" + element.getAttribute("data-price-helper-part-number")

export const render: PlasmoRender<PlasmoCSUIJSXContainer> = async (
  { anchor, createRootContainer },
  InlineCSUIContainer
) => {
  const rootContainer = await createRootContainer(anchor)

  const root = createRoot(rootContainer) // Any root
  const partNumber = anchor.element.getAttribute(
    "data-price-helper-part-number"
  )
  const preferredQuality = Number(
    (await prefsHook.getPrefs()).globalPreferredQuality
  ) as QualityFilter

  root.render(
    <InlineCSUIContainer>
      <ShopInline
        partNumber={partNumber}
        initialQualityFilter={preferredQuality}
      />
    </InlineCSUIContainer>
  )
}

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}
