import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Box, Tabs, TabList, Tab, TabPanels, TabPanel, Flex } from '@chakra-ui/react';
import Shmibblogo from './svgs/shmibblez_logo';
import ShmibblezTextLogo from './svgs/shmibblez_text_logo';
import { Home } from './pages/home';
import { Store } from './pages/store';
import { Cart } from './pages/cart';

function App() {
  return (
    <Box>
      <Tabs variant="line">
        <Flex direction="row">
          <Logos style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", padding: "8px" }} />
          <TabList flex="1" justifyContent="space-evenly" flexDirection={{ base: "column", sm: "row" }}>
            <Tab flex="1">HOME</Tab>
            <Tab flex="1">STORE</Tab>
            <Tab flex="1">CART</Tab>
          </TabList>
        </Flex>
        <TabPanels>
          <TabPanel><Home /></TabPanel>
          <TabPanel><Store /></TabPanel>
          <TabPanel><Cart /></TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default App;

function Logos(props: React.HTMLAttributes<HTMLDivElement>) {
  return (<div {...props} style={{ aspectRatio: "5/6", height: "150px", backgroundColor: "red", ...props.style }}>
    <Shmibblogo width="100%" />
    <ShmibblezTextLogo width="100%" />
  </div>)
}
