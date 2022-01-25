import { Box, Button, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import LeftArrow from '../svgs/left_arrow';
import RightArrow from '../svgs/right_arrow';
import "../css/store.css"
import { Item } from '../objects/item';
import { gql, useQuery } from '@apollo/client';
import { atom, useRecoilState } from 'recoil';

type QueryState = "loading" | "error" | "noMoreItems" | "idle";

const itemsState = atom<{ items: Item[], queryState: QueryState }>({
  key: "itemState",
  default: { items: [], queryState: "idle" }
})

export function Store() {
  return (
    <Box>
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
  let queryStateBarState = "error";
  switch (queryStateBarState) {
    case "error": // if error occurs, show message and button that triggers query retry
      return (
        <Flex p="1em" direction="row" bg="white">
          <Text flex="1">Failed to load, check wifi connection then retry. If not, I probably messed up some code, check back in a couple of days while I fix it.</Text>
          <Button onClick={() => { }}>Retry</Button>
        </Flex >)
    case "noMoreItems":
      return (<Box p="1em"><Text>no more items</Text></Box>)
    case "loading": // if loading show loading indicator
      // $$$ eventually make custom css loading animation
      return (<Box p="1em"><Text>loading...</Text></Box>)
    case "idle": // if idle, don't show 
    default:
      return null;
  }
}

function ItemsLoader() {
  const [state, setState] = useRecoilState(itemsState)


}

// items component does the following:
// - displays loaded items
// - loads more if necessary
// - if error occurs, notifies errorItem to display, user can trigger load more from here
function Items() {
  const [items, setItems] = useState<Item[]>([]);

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
        skip: items.length,
        forSale: false
      }
    }
  }
  const { loading, error, data, previousData, refetch } = useQuery(query, variables);

  if (error) {
    console.log("error: ", error)
  } else if (loading) {
    console.log("loading: ", loading)
  } else if (data && data != previousData) {
    console.log("data: ", data)
    const newItems = Item.parseGraphQLResult(data, "itemsForSale")
    items.push(...newItems)
  }

  const loadMoreItems = (win: Window, ev: Event) => {
    console.log("scroll event, body scrollHeight: ", document.body.scrollHeight,
      ", body clientHeight: ", document.body.clientHeight,
      ", window innerHeight: ", window.innerHeight)
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
  return items.map((item, indx) => (<ItemTile key={item._id} indx={indx} item={item} />))
}

// FIXME: where tf will u put loading function????????
// needs to be able to be called from Items and from QueryIndicator components
// 
// const [loadItems, { loading, error, data }] = useLazyQuery(gql`
// query itemsForSale($itemsForSaleInput: ItemsForSaleInput) {
//   itemsForSale(input: $itemsForSaleInput) {
//     _id
//     for_sale
//     img_urls
//     tags
//     times_acquired
//     countries {
//       col {
//         price
//         ccy
//         available {
//           total
//           s
//           m
//           l
//         }
//       }
//     }
//   }
// }
// `,
// {
//   variables: {
//     itemsForSaleInput: {
//       country: "col",
//       asc: true,
//       tags: [
//         "pattern"
//       ],
//       skip: 10,
//       forSale: false
//     }
//   }
// });

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