import styleText from "data-text:../style.css"
import type {
  PlasmoCSConfig,
  PlasmoCSUIJSXContainer,
  PlasmoGetInlineAnchorList,
  PlasmoGetShadowHostId,
  PlasmoGetStyle,
  PlasmoRender
} from "plasmo"
import { useEffect, useState, type FC } from "react"
import { createRoot } from "react-dom/client"

import { partsOrderedByPrice } from "~common/parts_listing"
import {
  QualityLevel,
  type PartInfo,
  type PartNumber,
  type PartsListing
} from "~common/types"
import { enumKeys, partInfoKey } from "~common/util"
import PartSummary from "~components/part_summary"
import QualitySelect from "~components/quality_select"
import { PreferencesHook } from "~frontend/preferences_hook"
import { getPartsListing, SearchError } from "~frontend/search"

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
  ) as QualityLevel

  root.render(
    <InlineCSUIContainer>
      <RealOEMShopInline
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

function filterAndSortParts(
  listing: PartsListing,
  quality: QualityLevel
): PartInfo[] {
  const filtered = partsMatchingQuality(listing, quality)
  return partsOrderedByPrice(filtered)
}

function partsMatchingQuality(
  listing: PartsListing,
  quality: QualityLevel
): PartInfo[] {
  // special case for QualityLevel.Unknown: return all
  if (quality == QualityLevel.Unknown) {
    return listing.parts
  }

  const matchingParts = listing.parts.filter(
    (part) => part.brand.quality == quality
  )
  if (matchingParts.length > 0) {
    return matchingParts
  }

  const betterParts = listing.parts.filter(
    (part) =>
      part.brand.quality != QualityLevel.Unknown &&
      part.brand.quality <= quality
  )
  if (betterParts.length > 0) {
    return betterParts
  }

  // failure; return all parts
  return listing.parts
}

function qualityLevelsUnavailable(listing: PartsListing): QualityLevel[] {
  const presentQualityLevels = [
    ...new Set(listing.parts.map((part) => part.brand.quality))
  ]
  const allQualityLevels = enumKeys(QualityLevel)
  return allQualityLevels.filter(
    (x) => !presentQualityLevels.includes(x) && x != QualityLevel.Unknown
  )
}

const RealOEMShopInline: FC<{
  partNumber: PartNumber
  initialQualityFilter: QualityLevel
}> = (props) => {
  const [partsListing, setPartsListing] = useState(null as PartsListing | null)
  const [errorMsg, setErrorMsg] = useState(
    null as { msg: string; url: URL } | null
  )
  const [selectedQuality, setSelectedQuality] = useState(
    props.initialQualityFilter
  )

  const unavailableQualities = partsListing
    ? qualityLevelsUnavailable(partsListing)
    : null

  useEffect(() => {
    async function getParts() {
      try {
        const partsListing = await getPartsListing(props.partNumber)
        setPartsListing(partsListing)
      } catch (err) {
        if (err instanceof SearchError) {
          setErrorMsg({ msg: "Not found", url: err.searchConfig.searchUrl })
        } else setErrorMsg({ msg: "Error", url: null })
      }
    }
    getParts()
  }, [])

  useEffect(() => {
    if (partsListing !== null) {
      if (partsListing && unavailableQualities.includes(selectedQuality)) {
        setSelectedQuality(QualityLevel.Unknown)
      }
    }
  }, [partsListing])

  if (partsListing) {
    return (
      <div className="flex flex-row space-x-2">
        <QualitySelect
          value={selectedQuality}
          valuesDisabled={unavailableQualities}
          setValue={setSelectedQuality}
        />
        <div className="whitespace-nowrap">
          {filterAndSortParts(partsListing, selectedQuality).map((part) => (
            <PartSummary key={partInfoKey(part)} part={part}></PartSummary>
          ))}
        </div>
      </div>
    )
  } else if (errorMsg) {
    return <a href={errorMsg.url.toString()}>{errorMsg.msg}</a>
  } else {
    return <span>Loading...</span>
  }
}

export default RealOEMShopInline
