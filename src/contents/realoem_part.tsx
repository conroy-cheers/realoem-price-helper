import styleText from "data-text:../style.css"
import type {
  PlasmoCSConfig,
  PlasmoCSUIJSXContainer,
  PlasmoGetInlineAnchor,
  PlasmoGetShadowHostId,
  PlasmoGetStyle,
  PlasmoRender
} from "plasmo"
import { createRoot } from "react-dom/client"

import type { QualityFilter } from "~common/quality_filter"
import ShopDetail from "~components/shop_detail"
import { PreferencesHook } from "~frontend/preferences_hook"

function insertAnchor() {
  const urlParams = new URLSearchParams(window.location.search)
  const partNumber = urlParams.get("q")

  const newDiv = document.createElement("div")
  newDiv.className = "price-helper-part-anchor"
  newDiv.setAttribute("data-price-helper-part-number", partNumber)

  const contentDiv = document.querySelector("div.content")
  const contentInfoElem = document.querySelector("div.content > dl")
  contentDiv.insertBefore(newDiv, contentInfoElem)
}

const prefsHook = new PreferencesHook()
insertAnchor()

export const config: PlasmoCSConfig = {
  matches: ["https://www.realoem.com/bmw/enUS/part*"]
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => {
  return document.querySelector("div.content > div.price-helper-part-anchor")
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
  const qualityFilter = Number(
    (await prefsHook.getPrefs()).globalPreferredQuality
  ) as QualityFilter

  root.render(
    <InlineCSUIContainer>
      <ShopDetail
        partNumber={partNumber}
        initialQualityFilter={qualityFilter}
      />
    </InlineCSUIContainer>
  )
}

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}
