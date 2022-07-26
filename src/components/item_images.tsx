import { Box, Flex, Img } from "@chakra-ui/react"
import React, { ReactElement, useState } from "react"
import { isTouchscreen } from ".."
import { Item } from "../objects/item"
import LeftArrow from "../svgs/left_arrow"
import RightArrow from "../svgs/right_arrow"
import "../css/item_images.css"

// FIXME: need to refine arrow size when container is too wide (currently oversized)

/**
 * ItemImages loads and shows item images from urls
 * 
 * @param props.innerWidth if provided, width used to constrain image while maintaining aspect ratio
 * if it werent for this, there's no way ItemImages could be rectanglar since it would fill remaining space
 * to maintain square aspect ratio
 */
// TODO: transition animation when switching images, show loading svg if image loading, show image when it loads.
// use <img> onload callback to detect when image loads (https://stackoverflow.com/questions/43115246/how-to-detect-when-a-image-is-loaded-that-is-provided-via-props-and-change-sta), 
// , also fade in when image does load
export const ItemImages = (props: { item: Item, innerwidth?: number } & React.HTMLAttributes<HTMLDivElement>) => {
  const [state, setState] = useState<{ item: Item; imgIndx: number; oldIndx: number | undefined }>({ item: props.item, imgIndx: 0, oldIndx: undefined })

  function leftArrowClick(e: React.SyntheticEvent) {
    e.stopPropagation()
    let newIndx = state.imgIndx - 1;
    if (newIndx < 0) newIndx = props.item.img_urls.length - 1 // this.state.item.img_urls.length - 1;
    setState({ ...state, imgIndx: newIndx, oldIndx: state.imgIndx })
  }
  function rightArrowClick(e: React.SyntheticEvent) {
    e.stopPropagation()
    let newIndx = state.imgIndx + 1
    if (newIndx > props.item.img_urls.length - 1 /*this.state.item.img_urls.length - 1*/) newIndx = 0
    setState({ ...state, imgIndx: newIndx, oldIndx: state.imgIndx })
  }

  return (
    <Box>
      <Flex id="item" transform="rotate(0)">
        <Flex w={props.innerwidth ?? "100%"} margin="auto">
          <Box {...props} transform="rotate(0)" bg="black" w="100%" display="block" paddingTop="100%" bgSize="cover" bgPos="center" >
            <React.Fragment>
              {state.item.img_urls.map((url, i) => (
                (
                  <Img {...props} loading="lazy" position="absolute" left="0" top="0" width="100%" height="100%" objectFit="cover" objectPosition="center"
                    src={url}
                    id={i === state.imgIndx ? "imgVisible" : (i === state.oldIndx ? "wasVisible" : "imgInvisible")}
                  // onLoad={() => {
                  //   state.imgsLoaded[state.imgIndx] = true
                  //   setState({ ...state, imgsLoaded: state.imgsLoaded })
                  // }} 
                  />
                )
              ))}
            </React.Fragment>
          </Box>
        </Flex>
        {/* arrows */}
        <Flex flex="1" id="arrows" className={isTouchscreen() ? "is-touchscreen" : ""} pos="absolute" top="0" left="0" width="100%" height="100%" flexDirection="row" alignItems="center" justifyContent="space-between">
          <Flex onClick={leftArrowClick} width="20%" height="30%" p="5%" alignItems="center" justifyContent="center"><LeftArrow stroke="#ffffffdd" /></Flex>
          <Flex onClick={rightArrowClick} width="20%" height="30%" p="5%" alignItems="center" justifyContent="center"><RightArrow stroke="#ffffffdd" /></Flex>
        </Flex>
      </Flex>
    </Box>
  )
}