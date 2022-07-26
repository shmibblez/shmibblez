import { Box, Text } from '@chakra-ui/react';

import { atom } from "recoil";
import { Colorz } from '..';
import { Item } from '../objects/item';

/**
 * the cart stores all the items someone's planning on buying
 * it shows items in the cart and allows editing
 */
export const cartState = atom<{
  // s: small, m: medium, l: large, n: no items in case no size
  [itemNo: number]: { item: Item, s?: number, m?: number, l?: number, n?: number }
}>({
  key: "cartState",
  default: {},
})


export const Cart = () => {
  return (
    <Box bg={Colorz.color2} p="1em">
      <Text color={Colorz.color3} fontWeight="bold" fontSize="3xl" >Coming soon</Text>
    </Box>
  )
}