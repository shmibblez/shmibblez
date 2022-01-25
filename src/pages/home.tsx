import { Box, SimpleGrid, Text } from '@chakra-ui/react';
import React from 'react';

import shmibblezLogo from "../pics/shmibblez_logo.png"
import shmetronomeLogo from "../pics/shmetronome_logo.png"

export const Home = (props: {}) => {
  return (
    <Box>
      <Box bg="black" p="1em" color="white">
        <Text fontSize="md">Hi i'm shmibblez, welcome to my website. I've made some programs and am currently making shirts. You can check those out over at the store, or take a look at some of my programming projects below.</Text>
      </Box >
      <Box bg="red" p="1em">
        <Text fontSize="3xl" paddingBottom="0.75em" fontWeight="bold" color="white">Programming Projects</Text>
        <SimpleGrid minChildWidth="200px" spacing="1em">
          <Project img={shmibblezLogo} name="geocomb" desc="A library for storing and retrieving locations. These locations are referenced by hexagons, into which a globe is split into. This hexagon web can have a chosen resolution, from a couple hexagons wrapping the globe to thousands. The reason I made this was because hexagons closely approximate circles, and one of the problems with traditional geohashing is that it splits the globe into unevenly sized rectangles. Although untested, geocomb is probably much slower than traditional geohashing." />
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
      <img src={props.img} width="100%" style={{ aspectRatio: "1" }} />
      <Text fontSize="xl" fontWeight="bold" color="white">{props.name}</Text>
      <Text fontSize="md" color="white">{props.desc}</Text>
    </Box>);
}