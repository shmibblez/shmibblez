export class Item {
  item_no: number;
  price: number
  img_urls: string[]
  tags: string[]
  times_acquired: number;

  constructor(item_no: number, price: number, img_urls: string[], tags: string[], times_acquired: number) {
    this.item_no = item_no
    this.price = price
    this.img_urls = img_urls
    this.tags = tags
    this.times_acquired = times_acquired
  }

  static random() {
    return new Item(
      Math.trunc(Math.random() * 100),
      40000,
      [`https://res.cloudinary.com/shmibblez/image/upload/v1642618044/samples/food/pot-mussels.jpg`, `https://res.cloudinary.com/shmibblez/image/upload/v1642618044/samples/food/fish-vegetables.jpg`],
      ["t-shirt", "black", "optical illusion", "pattern"],
      Math.trunc(Math.random() * 50),
    )
  }

  static parseJSON(json: any): Item {
    const prop = (p: string) => json[p]
    return new Item(
      prop("_id"),
      prop("price"),
      prop("img_urls"),
      prop("tags"),
      prop("times_acquired")
    )
  }

  static parseGraphQLResult(jsonResult: any, functionName: string): Item[] {
    console.log("parsed json: ", jsonResult)
    const items = [];
    for (let item in jsonResult[functionName]) {
      items.push(Item.parseJSON(item))
    }
    return items
  }
}