import { Injectable } from '@angular/core';
import { OnInit } from '@angular/core';
import { Item } from './item';
import { Order } from './order';
import { OrderLineItem } from './order-line-item';
import { TenderRecord } from './tender-record';
import { SalesTaxRate } from './sales-tax-rate';
import fs = require('fs');
import * as csvParse from 'csv-parse';

@Injectable()
export class CashRegisterService {
    items: Item[];

    ngOnInit(): void {
        var myParser:csvParse.CsvParser = csvParse({delimiter: ','}, function(data, err) {
            var items = [];

            for (var i = 1; i < data.length; i++) {
                if (data[i].length > 0) {
                    var item = new Item();
                    item.name = data[i][0];
                    item.price = data[i][1];
                    items.push(item);
                }
            }

          this.items = items;
        }) as csvParse.CsvParser;

        fs.createReadStream(__dirname + '/items.csv').pipe(myParser);

    }

    getItems(): Promise<Item[]> {
        return Promise.resolve(this.items);
    }
}
