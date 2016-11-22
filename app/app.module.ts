import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { RouterModule }   from '@angular/router';

import { AppComponent }        from './app.component';
import { CashRegisterComponent } from './cash-register.component';
import { CashRegisterService } from './cash-register.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([
      {
        path: 'cashregister',
        component: CashRegisterComponent
      }
    ])
  ],
  declarations: [
    AppComponent,
    CashRegisterComponent
  ],
  providers: [
    CashRegisterService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
