import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-bill-card',
  templateUrl: './bill-card.component.html',
  styleUrls: ['./bill-card.component.css']
})
export class BillCardComponent implements OnInit {

  @Input('bill') bill: any;
  @Input('currency') currency: any;

  dollar: number;
  euro: number;

  constructor() { }

  ngOnInit() {

    const { rates } = this.currency;
    this.dollar = rates['USD'] * this.bill.value;
    this.euro = rates['EUR'] * this.bill.value;

  }

}
