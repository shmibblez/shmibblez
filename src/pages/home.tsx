import { Box, Button, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import LeftArrow from '../svgs/left_arrow';
import RightArrow from '../svgs/right_arrow';
import "../css/store.css"
import { Item } from '../objects/item';
import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { apolloClient, isTouchscreen } from '..';
import { itemsForSaleQuery } from '../gql_queries';
import { activeItemState } from './item_box';
import { ItemImages } from '../components/itemImages';

// TODO: add popup container that shows products when they're clicked on
// popup should cover whole page with borders that are transparent but 
// darken page behind, it should appear to be floating
// popup will show product info in more detail, and will allow adding product
// to cart, selecting sizes, colors, etc (and seeing how many of each already 
// in cart)

export function Home() {
  return (
    <Box>
      <ItemsLoader />
      <Box bg="black" p="1em" pb="0">
        <Text display="inline-block" color="white" fontWeight="bold" fontSize="3xl">Coming soon</Text>
        <Box display="inline-block" width="0.25em" />
        <Text display="inline-block" color="white" fontSize="xs">.........there will be shirts here one day</Text>
      </Box>
      <Box bg="black" p="1em" color="white">
        <Text fontSize="md">Hi i'm shmibblez, welcome to my website, it's a work in progress. I'm currently making some shirts, but haven't actually finished one yet, so when that's done you'll be able to observe and hopefully purchase them. For now, however, you can take a look at some of my dev projects, and thats pretty much it lol</Text>
      </Box >
      <SimpleGrid minChildWidth={{ base: "auto", sm: "400px" }} id="storeGrid" border="1px solid white">
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
  set: ({ set, get }, newVal) => {
    const itemsLoader = get(itemsLoaderState)
    // if query state changed and has more items, change query state
    // prevents unecessary reloads
    if (itemsLoader.queryState !== newVal && itemsLoader.queryState !== "noMoreItems")
      set(itemsLoaderState, { ...itemsLoader, queryState: newVal })
  }
})
// loaded as component so can access atom
// is the only one that will edit itemsLoaderState atom, other components will access data from selectors
function ItemsLoader() {
  const [state, setState] = useRecoilState(itemsLoaderState)

  switch (state.queryState) {
    case "loading": {
      console.log("query loading")
      const query = itemsForSaleQuery
      const variables = {
        itemsForSaleInput: {
          country: "col",
          asc: true,
          tags: ["pattern"],
          skip: state.items.length,
          forSale: false
        }
      }
      apolloClient.query({ query: query, variables: variables, })
        .then(
          function onFulfilled(result) {
            if (result.error) {
              // console.log("-- error")
              setState({ ...state, queryState: "error", error: "unknown" })
            } else if (result.errors) {
              // console.log("-- errors")
              setState({ ...state, queryState: "error", error: "unknown" })
            } else if (result.data) {
              const newItems = Item.parseGQLResult(result.data, "itemsForSale")
              // console.log("-- data length: ", newItems.length)
              if (newItems.length <= 0) {
                setState({ ...state, queryState: "noMoreItems" });
              } else {
                setState({ ...state, items: state.items.concat(newItems), queryState: "doneLoading" })
              }
            }
          },
          function onRejected(error) {
            // console.log("query rejected, error: ", error)
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
  const [, setQueryState] = useRecoilState(queryState)

  const loadMoreItems = (win: Window, ev: Event) => {
    const bodyHeight = document.body.scrollHeight;
    const currentOffset = window.innerHeight + window.scrollY
    // the amount of space between currentOffset and bottom of page before loading more
    const threshold = window.innerHeight / 2; // px
    if (currentOffset > bodyHeight - 1 - threshold) {
      // console.log("reached bottom")
      setQueryState("loading")
    }
  }
  // listen to scroll changes to know if need to load more
  useEffect(() => {
    // @ts-ignore, add event listener
    window.addEventListener("scroll", loadMoreItems)
    // @ts-ignore, cleanup
    return () => { window.removeEventListener("scroll", loadMoreItems) }
  })
  const items = useRecoilValue(itemsState)
  return items.map((item, indx) => (<ItemTile key={item._id} indx={indx} item={item} />))
}

const placeholderURLs = [
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-1 -1 123.244 122' fill='none' stroke='%23FFF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.25'%3E%3Cpath d='M34.641 45v20m0-10-17.32-10m8.66 5 17.32-10m0 0v30m0 0 8.661 5m0 0L34.641 85m0-10v20m0 0 8.66-5m0 0v10m0 0-17.32 10m0 0V70m0 0 17.32 10m-17.32 30-8.66-5m0 0V65m0 0L0 55m0 0V45m0 0 34.641 20m-17.32-20 25.98-15m0 0-8.66-5m0 0L0 45m43.301 25 8.661-5m0 0 8.66 5m0 0 8.66-5m0 0 8.66 5m0 0-25.98 15m0 0 17.32 10m0 0v10m0 0L43.301 90m0 10 34.641 20m0 0V80m0 0-17.32 10m8.66 5V85m8.66-15V60m0 0 17.321 10m-8.66-5v20m0-10 17.32-10m0 0-8.66-5m0 0 8.66-5m0 0 17.321 10m0 0L86.603 85m-8.661 35 8.661-5m0 0V95m0 0 34.641-20m0 0V65m-25.981-5V30m0 0L77.942 40m8.661-5v20m0 0L60.622 40m0 0v10m0 0 8.66 5m0 0v10m17.321-20L69.282 35m0 0 34.641-20m0 0v40m0-40-8.66-5m0 0L77.942 20m0 0L43.301 0m0 0-8.66 5m0 0v20m8.66 5V20m0 0 17.321 10m-8.66-5v20m0 0 8.66-5m0 10-8.66 5m0 0v10m0-30 17.32-10m0 0L34.641 5'/%3E%3C/svg%3E")`,
  `url("data:image/svg+xml,%3Csvg stroke-linejoin='bevel' stroke-linecap='square' stroke-width='.55' stroke='%23FFF' fill='none' xmlns='http://www.w3.org/2000/svg' viewBox='0 -22 49 49'%3E%3Cpath d='M.5 4.5h4l-4-4h4m2 0v4m0-2h4m0 2v-4m2 4v-4l2 2 2-2v4m2 0v-4m2 0v4h2l2-1-2-1 2-1-2-1h-2m0 2h2m4-2v4h2l2-1-2-1 2-1-2-1h-2m0 2h2m4-2v4h4m2-2h4m0 2h-4v-4h4m2 0h4l-4 4h4'/%3E%3C/svg%3E")`
]

const ItemTile = (props: { indx: number, item: Item }) => {
  const itemsPerRow = () => {
    const grid = document.getElementById("storeGrid")
    if (!grid) return -1
    return getComputedStyle(grid).getPropertyValue("grid-template-columns").split(" ").length
  }
  const [state, setState] = useState<{ indx: number, item: Item, itemsPerRow: number }>(
    {
      indx: props.indx, // index of item in grid
      item: props.item,
      itemsPerRow: itemsPerRow(), // items per row, for figuring out if row colors reversed
    }
  )

  useEffect(() => {
    function onResize() {
      // prevent pointless rebuilds
      const n = itemsPerRow()
      if (n === state.itemsPerRow) return
      // cell color depends on how many columns there are
      setState({ ...state, itemsPerRow: itemsPerRow() })
    }
    window.addEventListener("resize", onResize)
    onResize()
    // FIXME: itemTile colors not set smoothly on first render
    return function cleanup() {
      window.removeEventListener("resize", onResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.itemsPerRow])

  const setActieItemState = useSetRecoilState(activeItemState)
  const showItemBox = (e: React.SyntheticEvent) => {
    console.log("clicked item")
    console.log(e.target)
    setActieItemState(state.item)
  }

  // start at opposite color if number of rows odd and column number is odd
  const isOdd = (n: number) => { return n % 2 === 1 }
  const isEven = (n: number) => { return !isOdd(n) }
  const colNum = Math.trunc(state.indx / state.itemsPerRow)
  const reversed = isEven(state.itemsPerRow) && isOdd(colNum)
  const bgColor = reversed ? (isOdd(state.indx) ? "red" : "black") : (isOdd(state.indx) ? "black" : "red")
  const textColor = "white" //reversed ? (isOdd(props.indx) ? "black" : "white") : (isOdd(props.indx) ? "white" : "black")
  const subTextColor = "gray" //reversed ? (isOdd(props.indx) ? "black" : "gray") : (isOdd(props.indx) ? "gray" : "black")
  return (
    <Box id="item" p="2em" background={bgColor} border="2px solid white" onClick={showItemBox}>
      {/* transform that does nothing to establish positioning context for absolute positioning */}
      <ItemImages item={state.item} />
      <Text color={subTextColor} fontSize="sm" as="i" fontWeight="bold">item #{state.item._id}</Text>
      <Text color={textColor} fontWeight="bold">price: ${state.item.price},00 COP</Text>
    </Box>
  )
}