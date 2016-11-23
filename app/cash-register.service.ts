import { Injectable } from '@angular/core';
import { OnInit } from '@angular/core';
import { Item } from './item';
import { Order } from './order';
import { OrderLineItem } from './order-line-item';
import { TenderRecord } from './tender-record';
import { SalesTaxRate } from './sales-tax-rate';

@Injectable()
export class CashRegisterService {
    items: Item[];
    orders: Order[] = [];
    tax: SalesTaxRate;

    constructor() {
        // I tried for a long while to get the fs and csv modules working in TypeScript, but the page kept trying to load them as files in the web root and 404ing
        // The compiler didn't complain and the definitions were there, but at runtime, require() behaved like they didn't exist so I have to hardcode these :(
        var data = [
            [ 'Supreme Pizza', 16.99 ],
            [ 'BBQ Chicken Pizza', 14.99 ],
            [ 'Veggie Pizza', 12.99 ],
            [ 'Meat Lover’s Pizza', 17.99 ],
            [ 'Hawaiian Pizza', 14.99 ],
            [ 'Supreme Calzone', 8.99 ],
            [ 'BBQ Chicken Calzone', 7.99 ],
            [ 'Veggie Calzone', 6.99 ],
            [ 'Meat Lover’s Calzone', 8.99 ],
            [ 'Hawaiian Calzone', 7.99 ],
            [ 'Side Salad', 3.99 ],
            [ 'Ceasar Salad', 4.99 ],
            [ 'Cobb Salad', 4.99 ],
            [ 'Chef Salad', 5.99 ],
            [ 'Grilled Cheese', 3.99 ],
            [ 'Coke', 1.00 ],
            [ 'Diet Coke', 1.00 ],
            [ 'Sprite', 1.00 ],
            [ 'Dr. Pepper', 1.00 ],
            [ 'Root Beer', 1.00 ]
        ];

        var items: Item[] = [];

        for (var i = 0; i < data.length; i++) {
            var item = new Item();
            item.name = data[i][0] as string;
            item.price = data[i][1] as number;
            items.push(item);
        }

        this.items = items;

        this.tax = new SalesTaxRate();
        this.tax.rate = .07;
    }

    recalculateTotals(order: Order): void {
        var subTotal = 0;

        for (var i = 0; i < order.items.length; i++)
          subTotal += order.items[i].extendedPrice;

        order.subTotal = subTotal;
        order.totalTax = subTotal * this.getTax();
        order.grandTotal = order.subTotal + order.totalTax;
    }

    addItem(order: Order, item: Item): void {
        var lineItem: OrderLineItem;

        for (var i = 0; i < order.items.length; i++) {
          lineItem = order.items[i];

          if (lineItem.item === item) {
              lineItem.addItem(item);

              this.recalculateTotals(order);

              return;
          }
        }

        lineItem = new OrderLineItem();
        lineItem.addItem(item);

        order.items.push(lineItem);

        this.recalculateTotals(order);
    }

    getItems(): Promise<Item[]> {
        return Promise.resolve(this.items);
    }

    getTax(): number {
        return this.tax.rate;
    }

    makePayment(order: Order, amount: number): boolean {
        if (amount < order.grandTotal)
            return false;

        order.tenderRecord = new TenderRecord();
        order.tenderRecord.amountTendered = amount;
        order.tenderRecord.changeGiven = amount - order.grandTotal;

        var lastOrderNumber: number;

        if (this.orders.length > 0) {
            lastOrderNumber = this.orders[this.orders.length - 1].orderNumber;

            if (lastOrderNumber == 100)
                lastOrderNumber = 0;
        } else {
            lastOrderNumber = 0;
        }

        lastOrderNumber++;

        order.orderNumber = lastOrderNumber;

        order.timestamp = new Date().getTime();

        this.orders.push(order);

        return true;
    }

    changeQuantity(order: Order, item: Item, qty: number): void {
        var lineItem: OrderLineItem;

        for (var i = 0; i < order.items.length; i++) {
          lineItem = order.items[i];

          if (lineItem.item === item) {
              lineItem.qty = qty;

              this.recalculateTotals(order);

              return;
          }
        }

        if (qty > 0) {
            lineItem = new OrderLineItem();
            lineItem.addItem(item);

            order.items.push(lineItem);

            this.recalculateTotals(order);
        }
    }

    removeItem(order: Order, item: Item): boolean {
        var lineItem: OrderLineItem;

        for (var i = 0; i < order.items.length; i++) {
          lineItem = order.items[i];

          if (lineItem.item === item) {
              order.items.splice(i, 1);

              this.recalculateTotals(order);

              return true;
          }
        }

        return false;
    }
}
