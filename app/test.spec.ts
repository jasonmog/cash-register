import { Item } from './item';
import { Order } from './order';
import { OrderLineItem } from './order-line-item';
import { TenderRecord } from './tender-record';
import { SalesTaxRate } from './sales-tax-rate';
import { CashRegisterService } from './cash-register.service';

describe('Add items', () => {
    var order = new Order();

    var item = new Item();
    item.name = 'Pizza';
    item.price = 1;

    var service = new CashRegisterService();

    it('First item', () => {
        service.addItem(order, item);
        expect(order.items.length).toBe(1);

        var lineItem = order.items[0];
        expect(lineItem.qty).toBe(1);
        expect(lineItem.price).toBe(item.price);
        expect(lineItem.extendedPrice).toBe(lineItem.qty * lineItem.price);

        expect(order.subTotal).toBe(item.price);
        expect(order.totalTax).toBe(order.subTotal * service.getTax());
        expect(order.grandTotal).toBe(order.subTotal + order.totalTax);
    });

    it('Second item', () => {
        service.addItem(order, item);
        expect(order.items.length).toBe(1);

        var lineItem = order.items[0];
        expect(lineItem.qty).toBe(2);
        expect(lineItem.price).toBe(item.price);
        expect(lineItem.extendedPrice).toBe(lineItem.qty * lineItem.price);

        expect(order.subTotal).toBe(lineItem.extendedPrice);
        expect(order.totalTax).toBe(order.subTotal * service.getTax());
        expect(order.grandTotal).toBe(order.subTotal + order.totalTax);
    });

    var expectedSubtotal = 0;

    it('Third item', () => {
        item = new Item();
        item.name = 'Sandwich';
        item.price = 2;

        service.addItem(order, item);
        expect(order.items.length).toBe(2);

        var lineItem = order.items[1];
        expect(lineItem.qty).toBe(1);
        expect(lineItem.price).toBe(item.price);
        expect(lineItem.extendedPrice).toBe(lineItem.qty * lineItem.price);

        expectedSubtotal = 0;

        for (var i = 0; i < order.items.length; i++) {
            lineItem = order.items[i];

            expectedSubtotal += lineItem.extendedPrice;
        }

        expect(order.subTotal).toBe(expectedSubtotal);
        expect(order.totalTax).toBe(order.subTotal * service.getTax());
        expect(order.grandTotal).toBe(order.subTotal + order.totalTax);
    });

    it('Recalculate totals', () => {
        service.recalculateTotals(order);

        expect(order.subTotal).toBe(expectedSubtotal);
        expect(order.totalTax).toBe(order.subTotal * service.getTax());
        expect(order.grandTotal).toBe(order.subTotal + order.totalTax);
    });
});

describe('Change quantity', () => {
    var order = new Order();

    var item = new Item();
    item.name = 'Pizza';
    item.price = 1;

    var service = new CashRegisterService();

    it('Change quantity to 1', () => {
        service.changeQuantity(order, item, 1);
        expect(order.items.length).toBe(1);

        var lineItem = order.items[0];
        expect(lineItem.qty).toBe(1);
    });

    it('Change quantity to 2', () => {
        service.changeQuantity(order, item, 2);
        expect(order.items.length).toBe(1);

        var lineItem = order.items[0];
        expect(lineItem.qty).toBe(2);
    });
});

describe('Remove item', () => {
    var order = new Order();

    var item = new Item();
    item.name = 'Pizza';
    item.price = 1;

    var service = new CashRegisterService();

    it('Remove a nonexistent item', () => {
        service.removeItem(order, item);
    });

    it('Add and remove item', () => {
        service.addItem(order, item);
        service.removeItem(order, item);
        expect(order.items.length).toBe(0);
    });
});

describe('Complete order', () => {
    var order = new Order();

    var item = new Item();
    item.name = 'Pizza';
    item.price = 1;

    var service = new CashRegisterService();

    it('Make payment', () => {
        var amount = 10;
        var result = service.makePayment(order, amount);
        expect(result).toBe(true);
        expect(order.tenderRecord).not.toBe(undefined);
        expect(order.tenderRecord.amountTendered).toBe(amount);
        expect(order.tenderRecord.timestamp).not.toBe(undefined);
        expect(order.tenderRecord.changeGiven).toBe(amount - order.grandTotal);
    });
});
