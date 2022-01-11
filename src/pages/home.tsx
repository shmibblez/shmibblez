import { Box, Text } from '@chakra-ui/react';
import React from 'react';

export const Home = (props: {}) => {
  return (
    <Box>
      <Box bg="black" p="8px" color="white">
        <Text fontSize="md">Hi i'm shmibblez, welcome to my website. I've made some programs and am currently making shirts. You can see some of those over at the store, or take a look at some of my programming projects below.</Text>
      </Box >
      <Box bg="white">
        {/* grid with spaces in between like xoco gallery
            row height wraps around tallest row item */}
      </Box>
    </Box>);
}