import { OrderLineItem } from './order-line-item';
import { TenderRecord } from './tender-record';

export class Order {
  orderNumber: number;
  timestamp: number;
  subTotal: number;
  totalTax: number;
  grandTotal: number;
  items: OrderLineItem[] = [];
  tenderRecord: TenderRecord;
}
