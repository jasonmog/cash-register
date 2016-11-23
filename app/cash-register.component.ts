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
    lastItems: Item[] = [];

    constructor(private cashRegisterService: CashRegisterService) {
        this.order = new Order();
    }

    ngOnInit(): void {
        this.cashRegisterService.getItems().then(items => this.items = items);
    }

    addItem(item: Item): void {
        this.lastItems.push(item);

        this.cashRegisterService.addItem(this.order, item);
    }

    pay(): void {
        if (this.cashRegisterService.makePayment(this.order, 100)) {
            this.order = new Order();
            this.lastItems.splice(0);
        }
    }

    voidLastItem(): void {
        while (this.lastItems.length > 0 && !this.cashRegisterService.removeItem(this.order, this.lastItems[this.lastItems.length - 1]))
            this.lastItems.splice(this.lastItems.length - 1);
    }
}
