import {Component, OnDestroy, OnInit} from '@angular/core';
import {BillService} from '../services/bill.service';
import {combineLatest, Observable, Subscription} from 'rxjs';
import {delay} from 'rxjs/operators';

@Component({
  selector: 'app-bill-page',
  templateUrl: './bill-page.component.html',
  styleUrls: ['./bill-page.component.css']
})
export class BillPageComponent implements OnInit, OnDestroy {

  sub1: Subscription;
  sub2: Subscription;

  currency: any;
  bill: any;
  isLoaded = false;

  constructor(private billSvc: BillService) { }

  ngOnInit() {
    // combineLatest method combines two streams into one and allows subscribe to stream
    this.sub1 = combineLatest(
      this.billSvc.getBill(),
      this.billSvc.getCurrency()
    ).subscribe((data: [any, any]) => {
      this.bill = data[0];
      this.currency = data[1];

      this.isLoaded = true;
    });
  }



  onRefresh() {
    this.isLoaded = false;
    this.sub2 = this.billSvc.getCurrency()
      .subscribe((currency: any) => {
        this.currency = currency;

        setTimeout(() => {
          this.isLoaded = true;
        }, 1000);

      });
  }


  ngOnDestroy() {
    // unsubscribe from the stream so as not to occupy virtual memory
    this.sub1.unsubscribe();
      if (this.sub2) {
        this.sub2.unsubscribe();
      }
  }

}
