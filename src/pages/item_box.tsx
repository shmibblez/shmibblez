import { Box, Flex, Grid, GridItem, Input, Text, useBreakpointValue } from "@chakra-ui/react"
import { atom, useRecoilState } from "recoil"
import { Item } from "../objects/item"
import React, { useEffect, useState } from "react"
import X from "../svgs/x"
import { ItemImages } from "../components/item_images"
import ShoppingCart from "../svgs/shopping_cart"
import UpArrow from "../svgs/up_arrow"
import DownArrow from "../svgs/down_arrow"
import { LargeLetter, MediumLetter, SmallLetter } from "../svgs/size_letters"
import { Colorz } from ".."


/**
 * item box shows all item info
 * it pops up when an item is clicked on
 */

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
    setActiveItemState(null)
  }

  return (
    <Box {...props} bg="whiteAlpha.500" h="100%" p="2em" pos="fixed" left="0" top="0" right="0" bottom="0" onClick={hideItemBox}>
      <Box overflowY="scroll" color={Colorz.color2} bgColor={Colorz.color2} p="2em" h="100%" transform="rotate(0)" onClick={e => { e.stopPropagation() }}>
        {/* TODO: add ui according to plans/blueprint */}
        <ItemImages item={item} innerwidth={imagesWidth} style={{ zIndex: 0 }} />
        <Box zIndex="1" p="2em" pos="absolute" top="0" right="0" w="6em" h="6em" onClick={hideItemBox}><X /></Box>
        <Text color="gray" fontSize="sm" as="i" fontWeight="bold">item #{item._id}</Text>
        <Text color={Colorz.color3} fontWeight="bold">price: ${item.price},00 COP</Text>
        <Text color={Colorz.color3} fontWeight="bold" pb="0.5em">add to cart:</Text>
        <SizeAndAmtSelector item={item} />
      </Box >
    </Box >
  )
}

const Spacer = (props: { ems?: string }) => (<Box w={(props.ems ?? "1") + "em"} />)
/* TODO: set cart state from here depending on selections */
const SizeAndAmtSelector = (props: { item: Item }) => {
  const item = props.item
  const templateColumns = useBreakpointValue({
    base: "repeat(2, minmax(0px,auto))",
    sm: "repeat(3, minmax(0px,auto))",
    md: "repeat(4, minmax(0px,auto))"
  })
  return (
    <Grid border="1px solid white" p="1em" w="100%" templateColumns={templateColumns} gap="1em" alignItems="center" >
      <GridItem colSpan={{ base: 2, sm: 3, md: 1 }}><Flex height="4em" justifyContent="center"><ShoppingCart height="100%" /></Flex></GridItem>
      <GridItem><AmtSelector item={item} size={"s"} /></GridItem>
      <GridItem><AmtSelector item={item} size={"m"} /></GridItem>
      <GridItem><AmtSelector item={item} size={"l"} /></GridItem>
    </Grid >
  );

}

// TODO: sync with cart atom
type Size = "s" | "m" | "l"
const AmtSelector = (props: { item: Item, size: Size }) => {
  const [amt, setAmt] = useState(0)

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // parse & set new amtS
    let newAmt = parseInt(event.target.value)
    newAmt = isNaN(newAmt) ? 0 : newAmt
    // set after parsing
    setAmt(newAmt)
  }
  return (
    <Flex h="4em" flexDir="row" alignItems="center" justifyContent="center" >
      <SizeLetter size={props.size} />
      <Spacer ems="1" />
      <Flex direction="column" h="100%" p="0" justifyContent="space-between" border="1px solid white">
        {/* TODO: when adding/removing item, make sure cant go below 0 and is within available amount, else show error (errors can pile up below amount box, just add error element array below) */}
        <UpArrow height="25%" onClick={() => setAmt(amt + 1)} />
        <Input value={amt} onChange={onChange} p="0" textAlign="center" size="lg" color={Colorz.color3} width="0" minWidth="1.5em" height="40%" fontWeight="bold" border="1px solid white" borderRadius="0" />
        <DownArrow height="25%" onClick={() => setAmt(amt - 1)} />
      </Flex>
    </Flex>
  )
}

const SizeLetter = (props: { size: string }) => {
  switch (props.size) {
    case "s":
      return <SmallLetter style={{ height: "105%" }} />
    case "m":
      return <MediumLetter style={{ height: "105%" }} />
    case "l":
      return <LargeLetter style={{ height: "105%" }} />
    default:
      return null
  }
}