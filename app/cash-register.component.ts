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
    items: Item[];
    lastItems: Item[] = [];
    order: Order;
    isPaying: boolean;
    amountTendered: number;

    constructor(
        private cashRegisterService: CashRegisterService
    ) {
        this.order = new Order();
    }

    ngOnInit(): void {
        this.cashRegisterService.getItems().then(items => this.items = items);
    }

    addItem(item: Item): void {
        if (this.order.tenderRecord)
            return;

        this.lastItems.push(item);

        this.cashRegisterService.addItem(this.order, item);
    }

    makePayment(): void {
        if (this.order.tenderRecord)
            return;

        if (this.order.items.length === 0)
            return;

        this.amountTendered = null;

        this.isPaying = true;
    }

    pay(amount: number): void {
        if (this.cashRegisterService.makePayment(this.order, amount)) {
            this.isPaying = false;
        }
    }

    voidLastItem(): void {
        if (this.order.tenderRecord)
            return;
            
        while (this.lastItems.length > 0 && !this.cashRegisterService.removeItem(this.order, this.lastItems[this.lastItems.length - 1]))
            this.lastItems.splice(this.lastItems.length - 1);
    }
}
