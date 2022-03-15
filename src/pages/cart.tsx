import { Box, Text } from '@chakra-ui/react';

import { atom } from "recoil";
import { Item } from '../objects/item';

/// the cart stores all the items someone's planning on buying
export const cartState = atom<Item[]>({
  key: "cartState",
  default: [],
})


export const Cart = () => {
  return (
    <Box bg="black" p="1em">
      <Text color="white" fontWeight="bold" fontSize="3xl" >Coming soon</Text>
    </Box>
  )
}