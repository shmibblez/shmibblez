export class Item {
  _id: number;
  price: number
  img_urls: string[]
  tags: string[]
  times_acquired: number;

  constructor(_id: number, price: number, img_urls: string[], tags: string[], times_acquired: number) {
    this._id = _id
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
    return new Item(
      json._id,
      json.countries.col.price,
      json.img_urls,
      json.tags,
      json.times_acquired
    )
  }

  static parseGraphQLResult(obj: any, functionName: string): Item[] {
    const items = [];
    for (let item of obj[functionName]) {
      items.push(Item.parseJSON(item))
    }
    return items
  }
}