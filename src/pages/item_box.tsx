import { Box, Flex, Text } from "@chakra-ui/react"
import { atom, useRecoilState } from "recoil"
import { Item } from "../objects/item"
import React, { useEffect, useState } from "react"
import X from "../svgs/x"
import { ItemImages } from "../components/ItemImages"
import ShoppingCart from "../svgs/shopping_cart"
import UpArrow from "../svgs/up_arrow"
import DownArrow from "../svgs/down_arrow"


// item box shows all item info
// it pops up when an item is clicked on

export const activeItemState = atom<Item | null>({
  key: "activeItemState",
  default: null
})

/// when item is null, ItemBox is hidden
/// if item is not null, all item info is shown
export function ItemBox(props: React.HTMLAttributes<HTMLDivElement>) {
  function calcWidth() {
    const h = window.innerHeight * 7 / 12
    if (h < 200) return 200
    return h
  }
  console.log("ItemBox rebuilt")
  const [item, setActiveItemState] = useRecoilState(activeItemState)
  const [imagesWidth, setImagesWidth] = useState(calcWidth)
  // if no item active, hide window
  useEffect(() => {
    function onResize() {
      console.log("resized")
      const newWidth = calcWidth()
      // if no change in height, don't rebuild
      if (imagesWidth === newWidth) return
      setImagesWidth(newWidth)
    }
    window.addEventListener("resize", onResize)
    return function cleanup() {
      window.removeEventListener("resize", onResize)
    }
  })
  if (!item)
    return null

  const hideItemBox = (e: React.SyntheticEvent) => {
    e.stopPropagation()
    console.log("item box clicked")
    // console.log("----------")
    // console.log(e.currentTarget)
    // console.log(e.target)
    // console.log("----------")
    setActiveItemState(null)
    // FIXME: event propagation
  }

  return (
    <Box {...props} bg="whiteAlpha.500" h="100%" overflowY="scroll" p="2em" pos="fixed" left="0" top="0" right="0" bottom="0" onClick={hideItemBox}>
      <Box color="black" bgColor="black" p="2em" minH="100%" transform="rotate(0)" onClick={e => { e.stopPropagation() }}>
        {/* TODO: add ui according to plans/blueprint */}
        <Flex justifyContent="center"><Box w={imagesWidth}><ItemImages item={item} style={{ zIndex: 0 }} /></Box></Flex>
        <Box zIndex="1" p="2em" pos="absolute" top="0" right="0" w="6em" h="6em" onClick={hideItemBox}><X /></Box>
        <Text color="gray" fontSize="sm" as="i" fontWeight="bold">item #{item._id}</Text>
        <Text color="white" fontWeight="bold">price: ${item.price},00 COP</Text>
        <Text color="white" fontWeight="bold" pb="1em">sizes and amount:</Text>
        <SizeAndAmtSelector item={item} />
      </Box>
    </Box>
  )
}

const Spacer = (props: { ems?: string }) => (<Box w={(props.ems ?? "1") + "em"} />)
const SizeAndAmtSelector = (props: { item: Item }) => {
  const item = props.item
  return (
    <Flex border="1px solid white" p="1em" h="5em" flexDir="row" alignItems="center">
      {/* TODO: cart icon and up and down arrows with sizes and num items */}
      {/* TODO: set cart state from here depending on selections */}
      <Box h="3em" w="3em"><ShoppingCart /></Box>
      <Spacer />
      <Text>{item.availability}</Text>
      <AmtSelector item={item} size={"s"} />
      <Spacer />
      <AmtSelector item={item} size={"m"} />
      <Spacer />
      <AmtSelector item={item} size={"l"} />
    </Flex>
  )
}

// TODO: sync with cart atom
type Size = "s" | "m" | "l"
const AmtSelector = (props: { item: Item, size: Size }) => {
  return (
    <Flex flexDir="row" alignItems="center">
      <Text color="white" fontWeight="bold" fontSize="4xl">{(props.size as string).toUpperCase()}</Text>
      <Spacer ems="0.5" />
      <Flex flexDir="column">
        <UpArrow />
        <Text color="white" fontWeight="bold" fontSize="l">0</Text>
        <DownArrow />
      </Flex>
    </Flex>
  )
}