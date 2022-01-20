export class Item {
  item_no: number;
  price: number
  img_urls: string[]
  tags: string[]
  no_purchases: number;

  constructor(item_no: number, price: number, img_urls: string[], tags: string[], no_purchases: number) {
    this.item_no = item_no
    this.price = price
    this.img_urls = img_urls
    this.tags = tags
    this.no_purchases = no_purchases
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
}