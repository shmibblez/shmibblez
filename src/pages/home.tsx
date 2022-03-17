import { Box, Button, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import "../css/store.css"
import { Item } from '../objects/item';
import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { apolloClient } from '..';
import { itemsForSaleQuery } from '../gql_queries';
import { activeItemState } from './item_box';
import { ItemImages } from '../components/ItemImages';

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