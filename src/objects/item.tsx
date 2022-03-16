export class Item {
  _id: number;
  price: number
  img_urls: string[]
  tags: string[]
  times_acquired: number;
  availability: { [country: string]: { [color: string]: { [size: string]: number } } }

  constructor({
    _id, price, img_urls, tags, times_acquired, availability,
  }: { _id: number, price: number, img_urls: string[], tags: string[], times_acquired: number, availability: {} }) {
    this._id = _id
    this.price = price
    this.img_urls = img_urls
    this.tags = tags
    this.times_acquired = times_acquired
    this.availability = availability
  }

  static random() {
    return new Item(
      {
        _id: Math.trunc(Math.random() * 100),
        price: 40000,
        img_urls: [`https://res.cloudinary.com/shmibblez/image/upload/v1642618044/samples/food/pot-mussels.jpg`, `https://res.cloudinary.com/shmibblez/image/upload/v1642618044/samples/food/fish-vegetables.jpg`],
        tags: ["t-shirt", "black", "optical illusion", "pattern"],
        times_acquired: Math.trunc(Math.random() * 50),
        availability: {}
      }
    )
  }

  static parseJSON(json: any): Item {
    return new Item(
      {
        _id: json._id,
        price: json.countries.col.price,
        img_urls: json.img_urls,
        tags: json.tags,
        times_acquired: json.times_acquired,
        availability: json.availability
      }
    )
  }

  static parseGQLResult(obj: any, functionName: string): Item[] {
    const items = [];
    for (let item of obj[functionName]) {
      items.push(Item.parseJSON(item))
    }
    return items
  }
}