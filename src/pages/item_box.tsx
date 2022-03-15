import { Box } from "@chakra-ui/react"
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
  const [item, setState] = useRecoilState(activeItemState)
  // if no item active, hide window
  if (!item)
    return null

  return (
    <Box bg="whiteAlpha.100" pos="fixed" left="0" top="0" right="0" bottom="0" onClick={() => { setState(null) }}>
      <Box bg="black" p="2em">
        {/* TODO: add ui according to plans/blueprint */}
      </Box>
    </Box>
  )
}