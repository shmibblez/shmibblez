
const placeholderURLs = [
  `https://g1.img-dpreview.com/FF9CE2684532407EA326F7E9562EB91A.jpg`,
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-1 -1 123.244 122' fill='none' stroke='%23FFF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.25'%3E%3Cpath d='M34.641 45v20m0-10-17.32-10m8.66 5 17.32-10m0 0v30m0 0 8.661 5m0 0L34.641 85m0-10v20m0 0 8.66-5m0 0v10m0 0-17.32 10m0 0V70m0 0 17.32 10m-17.32 30-8.66-5m0 0V65m0 0L0 55m0 0V45m0 0 34.641 20m-17.32-20 25.98-15m0 0-8.66-5m0 0L0 45m43.301 25 8.661-5m0 0 8.66 5m0 0 8.66-5m0 0 8.66 5m0 0-25.98 15m0 0 17.32 10m0 0v10m0 0L43.301 90m0 10 34.641 20m0 0V80m0 0-17.32 10m8.66 5V85m8.66-15V60m0 0 17.321 10m-8.66-5v20m0-10 17.32-10m0 0-8.66-5m0 0 8.66-5m0 0 17.321 10m0 0L86.603 85m-8.661 35 8.661-5m0 0V95m0 0 34.641-20m0 0V65m-25.981-5V30m0 0L77.942 40m8.661-5v20m0 0L60.622 40m0 0v10m0 0 8.66 5m0 0v10m17.321-20L69.282 35m0 0 34.641-20m0 0v40m0-40-8.66-5m0 0L77.942 20m0 0L43.301 0m0 0-8.66 5m0 0v20m8.66 5V20m0 0 17.321 10m-8.66-5v20m0 0 8.66-5m0 10-8.66 5m0 0v10m0-30 17.32-10m0 0L34.641 5'/%3E%3C/svg%3E`,
  `data:image/svg+xml,%3Csvg stroke-linejoin='bevel' stroke-linecap='square' stroke-width='.55' stroke='%23FFF' fill='none' xmlns='http://www.w3.org/2000/svg' viewBox='0 -22 49 49'%3E%3Cpath d='M.5 4.5h4l-4-4h4m2 0v4m0-2h4m0 2v-4m2 4v-4l2 2 2-2v4m2 0v-4m2 0v4h2l2-1-2-1 2-1-2-1h-2m0 2h2m4-2v4h2l2-1-2-1 2-1-2-1h-2m0 2h2m4-2v4h4m2-2h4m0 2h-4v-4h4m2 0h4l-4 4h4'/%3E%3C/svg%3E`
]
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
        img_urls: placeholderURLs, //[`https://res.cloudinary.com/shmibblez/image/upload/v1642618044/samples/food/pot-mussels.jpg`, `https://res.cloudinary.com/shmibblez/image/upload/v1642618044/samples/food/fish-vegetables.jpg`],
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