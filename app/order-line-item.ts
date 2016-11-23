import { Item } from './item';

export class OrderLineItem {
  qty: number = 0;
  price: number;
  extendedPrice: number;
  item: Item;

  addItem(item: Item): void {
    this.item = item;
    this.qty++;
    this.extendedPrice = item.price * this.qty;
  }
}
