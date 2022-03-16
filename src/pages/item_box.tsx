import { Box, Text } from "@chakra-ui/react"
import { atom, useRecoilState } from "recoil"
import { Item } from "../objects/item"
import React from "react"
import X from "../svgs/x"
import { ItemImages } from "../components/itemImages"


// item box shows all item info
// it pops up when an item is clicked on

export const activeItemState = atom<Item | null>({
  key: "activeItemState",
  default: null
})

/// when item is null, ItemBox is hidden
/// if item is not null, all item info is shown
export function ItemBox(props: React.HTMLAttributes<HTMLDivElement>) {
  console.log("ItemBox rebuilt")
  const [item, setActiveItemState] = useRecoilState(activeItemState)
  // if no item active, hide window
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
        <Box zIndex="1" p="2em" pos="absolute" top="0" right="0" w="6em" h="6em" onClick={hideItemBox}><X /></Box>
        {/* TODO: add ui according to plans/blueprint */}
        <ItemImages item={item} style={{ zIndex: 0 }} />
        <Text color="gray" fontSize="sm" as="i" fontWeight="bold">item #{item._id}</Text>
        <Text color="white" fontWeight="bold">price: ${item.price},00 COP</Text>
        <Text color="white" fontWeight="bold">select size and quantity:</Text>
        <SizeAndQuantSelector item={item} />
      </Box>
    </Box>
  )
}

const SizeAndQuantSelector = (props: { item: Item }) => {
  const item = props.item
  return (
    <Box border="2px solid white" p="1em">
      {/* TODO: cart icon and up and down arrows with sizes and num items */}
      {/* TODO: set cart state from here depending on selections */}
      <Text>{item.availability}</Text>
    </Box>
  )
}