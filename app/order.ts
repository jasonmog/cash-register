import { OrderLineItem } from './order-line-item';
import { TenderRecord } from './tender-record';

export class Order {
  orderNumber: number;
  timestamp: number;
  subTotal: number = 0;
  totalTax: number = 0;
  grandTotal: number = 0;
  items: OrderLineItem[] = [];
  tenderRecord: TenderRecord;
}
