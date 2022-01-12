import { Box, SimpleGrid, Text } from '@chakra-ui/react';
import React from 'react';

export class Store extends React.Component<{}, { itemsPerRow: number }> {
  constructor(props: {}) {
    super(props)
    this.state = { itemsPerRow: 0 }
    this.onResize.bind(this)
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
    console.log("-- items per row: ", this.state.itemsPerRow)

    return (
      <Box>
        <Box bg="black" p="1em">
          <Text color="white" fontWeight="bold" fontSize="3xl" >Coming soon</Text>
        </Box>
        <SimpleGrid minChildWidth="400px" id="storeGrid">
          {loadItems(this.state.itemsPerRow)}
        </SimpleGrid>
      </Box>)
  }
}

function loadItems(itemsPerRow: number) {
  let items = []
  console.log("** items per row: ", itemsPerRow)

  for (let i = 0; i <= 10; i++) {
    items.push(<Item key={i * 2} itemsPerRow={itemsPerRow} indx={i} />)
  }
  return items
}
function Item(props: { itemsPerRow: number, indx: number }) {
  // start at opposite color if number of rows odd and column number is odd
  const isOdd = (n: number) => { return n % 2 === 1 }
  const isEven = (n: number) => { return !isOdd(n) }
  const colNum = Math.trunc(props.indx / props.itemsPerRow)
  const reversed = isEven(props.itemsPerRow) && isOdd(colNum)
  const bgColor = reversed ? (isOdd(props.indx) ? "black" : "white") : (isOdd(props.indx) ? "white" : "black")
  const textColor = reversed ? (isOdd(props.indx) ? "white" : "black") : (isOdd(props.indx) ? "black" : "white")
  const subTextColor = "gray"//reversed ? (isOdd(props.indx) ? "white" : "black") : (isOdd(props.indx) ? "black" : "white")
  return (
    <Box p="1em" background={bgColor}>
      <Box bg="transparent" border="1px solid" borderColor="gray"><svg viewBox="0 0 1 1" fill="transparent" width="100%" /></Box>
      <Text color={subTextColor} fontSize="sm" as="i">item #{props.indx}</Text>
      <Text color={textColor}>price: $40.000 COP</Text>
    </Box>
  )
}