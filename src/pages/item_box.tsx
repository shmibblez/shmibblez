import { Box, Text } from "@chakra-ui/react"
import React from "react"
import { atom, useRecoilState } from "recoil"
import { Item } from "../objects/item"


// item box shows all item info
// it pops up when an item is clicked on

export const activeItemState = atom<Item | null>({
  key: "activeItemState",
  default: null
})

/// when item is null, ItemBox is hidden
/// if item is not null, all item info is shown
export function ItemBox() {
  const [item, setActiveItemState] = useRecoilState(activeItemState)
  // if no item active, hide window
  if (!item)
    return null

  return (
    <Box bg="whiteAlpha.100" pos="fixed" left="0" top="0" right="0" bottom="0" onClick={() => { setActiveItemState(null) }}>
      <Box bg="black" p="2em">
        {/* TODO: add ui according to plans/blueprint */}
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
    </Box>
  )
}