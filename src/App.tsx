import React from 'react';
import './css/App.css';
import { Box, Tabs, TabList, Tab, TabPanels, TabPanel, Flex } from '@chakra-ui/react';
import Shmibblogo from './svgs/shmibblez_logo';
import ShmibblezTextLogo from './svgs/shmibblez_text_logo';
import { Dev } from './pages/dev';
import { Home } from './pages/home';
import { Cart } from './pages/cart';

// TODO: custom resolver, rename from itemsForSale to itemsCustom (better describes filter)
function App() {
  return (
    <Box>
      <Tabs variant="line" isLazy>
        <Flex direction="row">
          <Logos style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", padding: "8px" }} />
          <TabList flex="1" justifyContent="space-evenly" flexDirection={{ base: "column", sm: "row" }} bg="black" color="white">
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
  return (<div {...props} style={{ ...props.style, height: `${height}px`, width: `${height * 5 / 6}px`, backgroundColor: "red" }}>
    <Shmibblogo width="100%" />
    <ShmibblezTextLogo width="100%" />
  </div>)
}
