import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { RouterModule }   from '@angular/router';

import { CashRegisterComponent } from './cash-register.component';
import { CashRegisterService } from './cash-register.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule
  ],
  declarations: [
    CashRegisterComponent
  ],
  providers: [
    CashRegisterService
  ],
  bootstrap: [ CashRegisterComponent ]
})
export class AppModule {
}
