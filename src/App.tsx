import React from 'react';
import './css/App.css';
import { Box, Tabs, TabList, Tab, TabPanels, TabPanel, Flex } from '@chakra-ui/react';
import Shmibblogo from './svgs/shmibblez_logo';
import ShmibblezTextLogo from './svgs/shmibblez_text_logo';
import { Dev } from './pages/dev';
import { Home } from './pages/home';
import { Cart } from './pages/cart';
import { ItemBox } from './pages/item_box';
import { Colorz } from '.';

// TODO: custom resolver, rename from itemsForSale to itemsCustom (better describes filter)
function App() {
  return (
    <Box zIndex="1">
      {/* ItemBox shows item info */}
      <ItemBox style={{ zIndex: 2 }} />
      <Tabs variant="line" isLazy zIndex="1" position="relative" left="0" right="0">
        <Flex direction="row">
          <Logos style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", padding: "8px" }} />
          <TabList flex="1" justifyContent="space-evenly" flexDirection={{ base: "column", sm: "row" }} bg={Colorz.color2} color={Colorz.color3}>
            <Tab flex="1">HOME</Tab>
            <Tab flex="1">DEV</Tab>
            <Tab flex="1">CART</Tab>
          </TabList>
        </Flex>
        <TabPanels>
          <TabPanel><Home /></TabPanel>
          <TabPanel><Dev /></TabPanel>
          <TabPanel><Cart /></TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default App;

function Logos(props: React.HTMLAttributes<HTMLDivElement>) {
  // aspect ratio = 5/6
  const height = 150;
  return (<div {...props} style={{ ...props.style, height: `${height}px`, width: `${height * 5 / 6}px`, backgroundColor: Colorz.color1 }}>
    <Shmibblogo width="100%" />
    <ShmibblezTextLogo width="100%" />
  </div>)
}
