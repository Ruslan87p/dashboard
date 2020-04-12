import {Component, Input, OnInit} from '@angular/core';
import {WFMEvent} from '../../shared/models/event.model';
import {Category} from '../../../shared/models/category.model';

@Component({
  selector: 'app-history-events',
  templateUrl: './history-events.component.html',
  styleUrls: ['./history-events.component.css']
})
export class HistoryEventsComponent implements OnInit {

  @Input('categories') categories: Category[] = [];
  @Input('events') events: WFMEvent[] = [];
  searchValue = '';
  searchPlaceholder = 'Сумма';
  serchField = 'amount';

  constructor() { }

  ngOnInit() {

    this.events.forEach((e) => {
      e.catName = this.categories.find(c => c.id === e.category).name;
    });
  }


  getEventClass(e: WFMEvent) {
    return {
      'label': true,
      'label-danger': e.type === 'outcome',
      'label-success': e.type === 'income',
    };
  }


  changeCriteria(field: string) {
    const nameMap = {
      amount: 'Сумма',
      date: 'Дата',
      category: 'Категория',
      type: 'Тип'
    };


    this.searchPlaceholder = nameMap[field];
    this.serchField = field;
  }

}
