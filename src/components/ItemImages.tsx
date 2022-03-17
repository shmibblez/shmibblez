import { Box, Flex } from "@chakra-ui/react"
import { useState } from "react"
import { isTouchscreen } from ".."
import { Item } from "../objects/item"
import LeftArrow from "../svgs/left_arrow"
import RightArrow from "../svgs/right_arrow"

// FIXME: arrow hover show/hide not working in item_box page

const placeholderURLs = [
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-1 -1 123.244 122' fill='none' stroke='%23FFF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.25'%3E%3Cpath d='M34.641 45v20m0-10-17.32-10m8.66 5 17.32-10m0 0v30m0 0 8.661 5m0 0L34.641 85m0-10v20m0 0 8.66-5m0 0v10m0 0-17.32 10m0 0V70m0 0 17.32 10m-17.32 30-8.66-5m0 0V65m0 0L0 55m0 0V45m0 0 34.641 20m-17.32-20 25.98-15m0 0-8.66-5m0 0L0 45m43.301 25 8.661-5m0 0 8.66 5m0 0 8.66-5m0 0 8.66 5m0 0-25.98 15m0 0 17.32 10m0 0v10m0 0L43.301 90m0 10 34.641 20m0 0V80m0 0-17.32 10m8.66 5V85m8.66-15V60m0 0 17.321 10m-8.66-5v20m0-10 17.32-10m0 0-8.66-5m0 0 8.66-5m0 0 17.321 10m0 0L86.603 85m-8.661 35 8.661-5m0 0V95m0 0 34.641-20m0 0V65m-25.981-5V30m0 0L77.942 40m8.661-5v20m0 0L60.622 40m0 0v10m0 0 8.66 5m0 0v10m17.321-20L69.282 35m0 0 34.641-20m0 0v40m0-40-8.66-5m0 0L77.942 20m0 0L43.301 0m0 0-8.66 5m0 0v20m8.66 5V20m0 0 17.321 10m-8.66-5v20m0 0 8.66-5m0 10-8.66 5m0 0v10m0-30 17.32-10m0 0L34.641 5'/%3E%3C/svg%3E")`,
  `url("data:image/svg+xml,%3Csvg stroke-linejoin='bevel' stroke-linecap='square' stroke-width='.55' stroke='%23FFF' fill='none' xmlns='http://www.w3.org/2000/svg' viewBox='0 -22 49 49'%3E%3Cpath d='M.5 4.5h4l-4-4h4m2 0v4m0-2h4m0 2v-4m2 4v-4l2 2 2-2v4m2 0v-4m2 0v4h2l2-1-2-1 2-1-2-1h-2m0 2h2m4-2v4h2l2-1-2-1 2-1-2-1h-2m0 2h2m4-2v4h4m2-2h4m0 2h-4v-4h4m2 0h4l-4 4h4'/%3E%3C/svg%3E")`
]

/**
 * 
 * @param props.innerWidth if provided, width used to constrain image while maintaining aspect ratio
 * if it werent for this, there's no way ItemImages could be rectanglar since it would fill remaining space
 * to maintain square aspect ratio
 */
export const ItemImages = (props: { item: Item, innerWidth?: number } & React.HTMLAttributes<HTMLDivElement>) => {
  const [state, setState] = useState({ item: props.item, imgIndx: 0 })

  function leftArrowClick(e: React.SyntheticEvent) {
    e.stopPropagation()
    let newIndx = state.imgIndx - 1;
    if (newIndx < 0) newIndx = placeholderURLs.length - 1 // this.state.item.img_urls.length - 1;
    setState({ ...state, imgIndx: newIndx })
  }
  function rightArrowClick(e: React.SyntheticEvent) {
    e.stopPropagation()
    let newIndx = state.imgIndx + 1
    if (newIndx > placeholderURLs.length - 1 /*this.state.item.img_urls.length - 1*/) newIndx = 0
    setState({ ...state, imgIndx: newIndx })
  }
  return (
    <Box>
      <Flex id="item" transform="rotate(0)">
        <Flex w={props.innerWidth ?? "100%"} margin="auto">
          <Box {...props} w="100%" display="block" paddingTop="100%" bgImage={placeholderURLs[state.imgIndx] /* load item url: this.state.item.img_urls[this.state.imgIndx] */} bgSize="cover" bgPos="center" />
        </Flex>
        {/* arrows */}
        <Flex flex="1" id="arrows" className={isTouchscreen() ? "is-touchscreen" : ""} pos="absolute" top="0" left="0" width="100%" height="100%" flexDirection="row" alignItems="center" justifyContent="space-between">
          <Flex onClick={leftArrowClick} width="20%" height="30%" p="5%" alignItems="center"><LeftArrow stroke="white" /></Flex>
          <Flex onClick={rightArrowClick} width="20%" height="30%" p="5%" alignItems="center"><RightArrow stroke="white" /></Flex>
        </Flex>
      </Flex>
    </Box>
  )
}