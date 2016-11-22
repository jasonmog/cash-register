import { Component } from '@angular/core';
import { Order } from './order';
import { OrderLineItem } from './order-line-item';
import { Item } from './item';
import { SalesTaxRate } from './sales-tax-rate';
import { TenderRecord } from './tender-record';
import { CashRegisterService } from './cash-register.service';
import { OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'cash-register',
  templateUrl: 'cash-register.component.html',
  providers: [CashRegisterService]
})

export class CashRegisterComponent {
    title = 'Cash Register';
    items: Item[];
    order: Order;

    constructor(private cashRegisterService: CashRegisterService) { }

    ngOnInit(): void {
        this.cashRegisterService.getItems().then(items => this.items = items);
        this.voidOrder();
    }

    addItem(item): void {
        var lineItem: OrderLineItem;

        for (var i = 0; i < this.order.items.length; i++) {
            lineItem = this.order.items[i];

            if (lineItem.item === item) {
                lineItem.addItem(item);

                return;
            }
        }

        lineItem = new OrderLineItem();
        lineItem.addItem(item);

        this.order.items.push(lineItem);
    }

    pay(): void {

    }

    voidOrder(): void {
        this.order = new Order();
    }
}
