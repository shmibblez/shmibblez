import { Box, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import React from 'react';
import LeftArrow from '../svgs/left_arrow';
import RightArrow from '../svgs/right_arrow';
import "../css/store.css"
import { Item } from '../objects/item';

export class Store extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props)
  }
  render(): React.ReactNode {
    return (
      <Box>
        <Box bg="black" p="1em">
          <Text color="white" fontWeight="bold" fontSize="3xl" >Coming soon</Text>
        </Box>
        <SimpleGrid minChildWidth="400px" id="storeGrid">
          {loadItems()}
        </SimpleGrid>
      </Box>)
  }
}

function loadItems() {
  let items = []
  for (let i = 0; i <= 10; i++) {
    items.push(<ItemTile key={i * 2} indx={i} item={Item.random()} />)
  }
  return items
}

class ItemTile extends React.Component<{ indx: number, item: Item }, { indx: number, item: Item, itemsPerRow: number, imgIndx: number }> {
  constructor(props: { indx: number, item: Item }) {
    super(props)
    this.state = {
      indx: props.indx, // index of item in grid
      item: props.item,
      itemsPerRow: -1, // items per row, for figuring out if row colors reversed
      imgIndx: 0, // index of currently displayed image
    }
    // this.onResize.bind(this)
    this.leftArrowClick = this.leftArrowClick.bind(this)
    this.rightArrowClick = this.rightArrowClick.bind(this)
  }
  componentDidMount() {
    window.addEventListener("resize", this.onResize)
    this.onResize()
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize)
  }
  onResize = () => {
    const grid = document.getElementById("storeGrid")!
    this.setState({ itemsPerRow: getComputedStyle(grid).getPropertyValue("grid-template-columns").split(" ").length })
  }
  render(): React.ReactNode {
    // start at opposite color if number of rows odd and column number is odd
    const isOdd = (n: number) => { return n % 2 === 1 }
    const isEven = (n: number) => { return !isOdd(n) }
    const colNum = Math.trunc(this.state.indx / this.state.itemsPerRow)
    const reversed = isEven(this.state.itemsPerRow) && isOdd(colNum)
    const bgColor = reversed ? (isOdd(this.state.indx) ? "red" : "black") : (isOdd(this.state.indx) ? "black" : "red")
    const textColor = "white" //reversed ? (isOdd(props.indx) ? "black" : "white") : (isOdd(props.indx) ? "white" : "black")
    const subTextColor = "gray" //reversed ? (isOdd(props.indx) ? "black" : "gray") : (isOdd(props.indx) ? "gray" : "black")
    return (
      <Box id="item" p="1em" background={bgColor}>
        <Box transform="rotate(0deg)" display="block" bg="transparent" border="1px solid" borderColor="gray" style={{ aspectRatio: "1" }} bgImage={this.state.item.img_urls[this.state.imgIndx]} bgSize="cover" bgPos="center">
          {/* arrows */}
          <Flex id="arrows" pos="absolute" top="0" left="0" width="100%" height="100%" flexDirection="row" alignItems="center" justifyContent="space-between">
            <Flex onClick={this.leftArrowClick} width="20%" height="100%" p="5%" alignItems="center"><LeftArrow stroke="white" /></Flex>
            <Flex onClick={this.rightArrowClick} width="20%" height="100%" p="5%" alignItems="center"><RightArrow stroke="white" /></Flex>
          </Flex>
        </Box>
        <Text color={subTextColor} fontSize="sm" as="i" fontWeight="bold">item #{this.state.item.item_no}</Text>
        <Text color={textColor} fontWeight="bold">price: ${this.state.item.price},00 COP</Text>
      </Box>
    )
  }

  leftArrowClick() {
    let newIndx = this.state.imgIndx - 1;
    if (newIndx < 0) newIndx = this.state.item.img_urls.length - 1;
    this.setState({ imgIndx: newIndx })
  }

  rightArrowClick() {
    let newIndx = this.state.imgIndx + 1
    if (newIndx > this.state.item.img_urls.length - 1) newIndx = 0
    this.setState({ imgIndx: newIndx })
  }
}