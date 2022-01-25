import { Box, Button, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import LeftArrow from '../svgs/left_arrow';
import RightArrow from '../svgs/right_arrow';
import "../css/store.css"
import { Item } from '../objects/item';
import { ApolloError, gql, useQuery } from '@apollo/client';
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';
import { apolloClient } from '..';

export function Store() {
  return (
    <Box>
      <ItemsLoader />
      <Box bg="black" p="1em">
        <Text color="white" fontWeight="bold" fontSize="3xl">Coming soon</Text>
      </Box>
      <SimpleGrid minChildWidth="400px" id="storeGrid">
        {Items()}
      </SimpleGrid>
      <QueryStateBar />
    </Box>
  )
}

// shows indicators depending on query state:
// - loading: progress bar
// - error: message with retry button
// - idle: nothing, wears invisibility cloak
function QueryStateBar() {
  const [state, setState] = useRecoilState(queryState)
  switch (state) {
    case "error": // if error occurs, show message and button that triggers query retry
      return (
        <Flex p="1em" direction="row" bg="white">
          <Text flex="1">Failed to load, check wifi connection then retry. If not, I probably messed up some code, check back in a couple of days while I fix it.</Text>
          <Button onClick={() => { setState("loading") }}>Retry</Button>
        </Flex >)
    case "noMoreItems":
      return (<Box p="1em" bg="white"><Text>no more items</Text></Box>)
    case "loading": // if loading show loading indicator
      // $$$ eventually make custom css loading animation
      return (<Box p="1em" bg="white"><Text>loading...</Text></Box>)
    case "doneLoading": // if idle, don't show 
    default:
      return null;
  }
}

type QueryState = "loading" | "doneLoading" | "error" | "noMoreItems";
type QueryErrorCode = "unknown" | "maintenance";
const itemsLoaderState = atom<{ items: Item[], queryState: QueryState, error?: QueryErrorCode }>({
  key: "itemsLoaderState",
  default: { items: [], queryState: "loading", }
})
const itemsState = selector({
  key: "itemsState",
  get: ({ get }) => { return get(itemsLoaderState).items }
})
const queryState = selector<any>({
  key: "queryState",
  get: ({ get }) => { return get(itemsLoaderState).queryState },
  set: ({ set, get }, newVal) => { set(itemsLoaderState, { ...get(itemsLoaderState), queryState: newVal }) }
})
// loaded as component so can access atom
// is the only one that will edit itemsLoaderState atom, other components will access data from selectors
function ItemsLoader() {
  const [state, setState] = useRecoilState(itemsLoaderState)

  switch (state.queryState) {
    case "loading": {
      console.log("query loading")
      const query = gql`
      query itemsForSale($itemsForSaleInput: ItemsForSaleInput) {
        itemsForSale(input: $itemsForSaleInput) {
          _id
          for_sale
          img_urls
          tags
          times_acquired
          countries {
            col {
              price
              ccy
              available {
                total
                s
                m
                l
              }
            }
          }
        }
      }`
      const variables = {
        variables: {
          itemsForSaleInput: {
            country: "col",
            asc: true,
            tags: [
              "pattern"
            ],
            skip: state.items.length,
            forSale: false
          }
        }
      }
      apolloClient.query({ query: query, variables: variables })
        .then(
          function onFulfilled(result) {
            console.log("query fulfilled")
            if (result.error) {
              setState({ ...state, queryState: "error", error: "unknown" })
            } else if (result.errors) {
              setState({ ...state, queryState: "error", error: "unknown" })
            } else if (result.data) {
              const newItems = Item.parseGQLResult(result.data, "itemsForSale")
              if (newItems.length <= 0) {
                setState({ ...state, queryState: "noMoreItems" });
              } else {
                setState({ ...state, items: state.items.concat(newItems), queryState: "doneLoading" })
              }

            }
          },
          function onRejected(error) {
            console.log("query rejected, error: ", error)
            setState({ ...state, queryState: "error", error: "unknown" })
          }
        )
        .catch((e) => {

        })
      break;
    }
    case "error": { break; }
    case "doneLoading": { break; }
    case "noMoreItems": { break; }
  }
  return (<Box w="0" h="0" />)
}

// figures out when to request loading more items
function Items() {
  const loadMoreItems = (win: Window, ev: Event) => {
    console.log(
      "scroll event, body scrollHeight: ", document.body.scrollHeight,
      ", body clientHeight: ", document.body.clientHeight,
      ", window innerHeight: ", window.innerHeight
    )
    // TODO: determine when to load more items,
    // if 1 tile height away from bottom of page (or 100px for simplicity), load more items
    const bodyHeight = document.body.scrollHeight;
  }
  // listen to scroll changes to know if need to load more
  useEffect(() => {
    // add event listener
    // @ts-ignore
    window.addEventListener("scroll", loadMoreItems)
    // cleanup
    // @ts-ignore
    return () => { window.removeEventListener("scroll", loadMoreItems) }
  })
  const items = useRecoilValue(itemsState)
  return items.map((item, indx) => (<ItemTile key={item._id} indx={indx} item={item} />))
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
      <Box id="item" p="1em" background={bgColor} >
        <Box transform="rotate(0deg)" display="block" bg="transparent" border="1px solid" borderColor="gray" style={{ aspectRatio: "1" }} bgImage={this.state.item.img_urls[this.state.imgIndx]} bgSize="cover" bgPos="center">
          {/* arrows */}
          <Flex id="arrows" pos="absolute" top="0" left="0" width="100%" height="100%" flexDirection="row" alignItems="center" justifyContent="space-between">
            <Flex onClick={this.leftArrowClick} width="20%" height="100%" p="5%" alignItems="center"><LeftArrow stroke="white" /></Flex>
            <Flex onClick={this.rightArrowClick} width="20%" height="100%" p="5%" alignItems="center"><RightArrow stroke="white" /></Flex>
          </Flex>
        </Box>
        <Text color={subTextColor} fontSize="sm" as="i" fontWeight="bold">item #{this.state.item._id}</Text>
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