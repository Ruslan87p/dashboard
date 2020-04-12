import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Category} from '../../../shared/models/category.model';
import {NgForm} from '@angular/forms';
import {WFMEvent} from '../../shared/models/event.model';
import * as moment from 'moment';
import {EventsService} from '../../services/events.service';
import {BillService} from '../../services/bill.service';
import {map, mergeMap} from 'rxjs/operators';
import {Message} from '../../../shared/models/message.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit, OnDestroy {

  @Input() categories: Category[] = [];
  types = [
    {
      type: 'income',
      label: 'Доход'
    },
    {
      type: 'outcome',
      label: 'Расход'
    }
  ];
  message: Message;
  sub1: Subscription;
  sub2: Subscription;


  constructor(private eventsSvc: EventsService,
              private billSvc: BillService) {
  }

  ngOnInit() {
    this.message = new Message('danger', '');
  }


  private showMessage(text: string) {
    this.message.text = text;
    window.setTimeout(() => this.message.text = '', 5000);
  }


  onSubmit(form: NgForm) {
    let {amount, description, category, type} = form.value;
    if (amount < 0) amount *= -1;

    const event = new WFMEvent(
      type,
      amount,
      +category,
      moment().format('DD.MM.YYYY HH:mm:ss'),
      description
    );

    this.sub1 = this.billSvc.getBill()
      .subscribe((bill: Bill) => {
        let value = 0;
        if (type === 'outcome') {

          if (amount > bill.value) {
            this.showMessage(`На счету недостаточно средствю Вам нехватает ${amount - bill.value}`);
            return;
          } else {
            value = bill.value - amount;
          }

        } else {
          value = bill.value + amount;
        }

        this.sub2 = this.billSvc.updateBill({value, currency: bill.currency})
          .pipe(mergeMap(() => this.eventsSvc.addEvent(event)))
          .subscribe(() => {
            form.setValue({
              amount: 0,
              description: ' ',
              category: 1,
              type: 'outcome'
            });
          });
      });

  }

  ngOnDestroy(): void {
    if (this.sub1) this.sub1.unsubscribe();
    if (this.sub2) this.sub2.unsubscribe();
  }

}
