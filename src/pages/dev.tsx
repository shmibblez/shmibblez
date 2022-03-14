import { Box, SimpleGrid, Text } from '@chakra-ui/react';
// import React from 'react';

// import shmibblezLogo from "../pics/shmibblez_logo.png"
import shmetronomeLogo from "../pics/shmetronome_logo.png"

export const Dev = (props: {}) => {
  return (
    <Box>
      <Box bg="black" p="1em" color="white">
        <Text fontSize="md">These are some of my programming projects, they'll probably come in handy someday.</Text>
      </Box >
      <Box bg="red" p="1em">
        <Text fontSize="3xl" paddingBottom="0.75em" fontWeight="bold" color="white">Programming Projects</Text>
        <SimpleGrid minChildWidth={{ base: "auto", sm: "200px" }} spacing="1em">
          <Project img={`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-1 -1 123.244 122' fill='none' stroke='%23FFF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.25'%3E%3Cpath d='M34.641 45v20m0-10-17.32-10m8.66 5 17.32-10m0 0v30m0 0 8.661 5m0 0L34.641 85m0-10v20m0 0 8.66-5m0 0v10m0 0-17.32 10m0 0V70m0 0 17.32 10m-17.32 30-8.66-5m0 0V65m0 0L0 55m0 0V45m0 0 34.641 20m-17.32-20 25.98-15m0 0-8.66-5m0 0L0 45m43.301 25 8.661-5m0 0 8.66 5m0 0 8.66-5m0 0 8.66 5m0 0-25.98 15m0 0 17.32 10m0 0v10m0 0L43.301 90m0 10 34.641 20m0 0V80m0 0-17.32 10m8.66 5V85m8.66-15V60m0 0 17.321 10m-8.66-5v20m0-10 17.32-10m0 0-8.66-5m0 0 8.66-5m0 0 17.321 10m0 0L86.603 85m-8.661 35 8.661-5m0 0V95m0 0 34.641-20m0 0V65m-25.981-5V30m0 0L77.942 40m8.661-5v20m0 0L60.622 40m0 0v10m0 0 8.66 5m0 0v10m17.321-20L69.282 35m0 0 34.641-20m0 0v40m0-40-8.66-5m0 0L77.942 20m0 0L43.301 0m0 0-8.66 5m0 0v20m8.66 5V20m0 0 17.321 10m-8.66-5v20m0 0 8.66-5m0 10-8.66 5m0 0v10m0-30 17.32-10m0 0L34.641 5'/%3E%3C/svg%3E`} name="geocomb" desc="A library for storing and retrieving locations. These locations are referenced by hexagons, into which a globe is split into. This hexagon web can have a chosen resolution, from a couple hexagons wrapping the globe to thousands. The reason I made this was because hexagons closely approximate circles, and one of the problems with traditional geohashing is that it splits the globe into unevenly sized rectangles. Although untested, geocomb is probably much slower than traditional geohashing." />
          <Project img={shmetronomeLogo} name="chronos" desc="A metronome app that allows storing presets and some other ways of visualizing tempo. The reason I made this was to gain some experience with Flutter and because I needed a metronome app. It'll be available on the play store soon." />
        </SimpleGrid>
        {/* grid with spaces in between like xoco gallery
            row height wraps around tallest row item */}
      </Box>
    </Box>);
}

function Project(props: { img: string, name: string, desc: string }) {
  return (
    <Box {...props} bg="#000" p="1em">
      <Box width="100%" paddingTop="100%" transform="rotate(0)">
        <img src={props.img} style={{ position: "absolute", left: 0, top: 0, width: "100%" }} alt="epic pic here"></img>
      </Box>
      <Text fontSize="xl" fontWeight="bold" color="white">{props.name}</Text>
      <Text fontSize="md" color="white">{props.desc}</Text>
    </Box>);
}