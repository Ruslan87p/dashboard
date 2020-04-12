import {Component, OnDestroy, OnInit} from '@angular/core';
import {BillService} from '../services/bill.service';
import {CategoriesService} from '../services/categories.service';
import {EventsService} from '../services/events.service';
import {combineLatest, Subscription} from 'rxjs';
import {Category} from '../../shared/models/category.model';
import {WFMEvent} from '../shared/models/event.model';

@Component({
  selector: 'app-planning-page',
  templateUrl: './planning-page.component.html',
  styleUrls: ['./planning-page.component.css']
})
export class PlanningPageComponent implements OnInit, OnDestroy {

  isLoaded = false;
  sub1: Subscription;
  bill: Bill;
  categories: Category[] = [];
  events: WFMEvent[] = [];

  constructor(private billSvc: BillService,
              private categoriesSvc: CategoriesService,
              private eventsSvc: EventsService) { }

  ngOnInit() {
    this.sub1 = combineLatest(
      this.billSvc.getBill(),
      this.categoriesSvc.getCategories(),
      this.eventsSvc.getEvents()
    ).subscribe((data: [Bill, Category[], WFMEvent[]]) => {
        this.bill = data[0];
        this.categories = data[1];
        this.events = data[2];

        this.isLoaded = true;
    });
  }

  getCategoryCost(cat: Category): number {
    const catEvents = this.events.filter(e => e.category === cat.id && e.type === 'outcome');
    // TODO write comment
    return catEvents.reduce((total, e) => {
      total += e.amount;
      return total;
    }, 0);
  }


  private getPercent(cat: Category): number {
    const percent = (100 * this.getCategoryCost(cat) / cat.capacity);
    return percent > 100 ? 100 : percent;
  }
  getCatPercent(cat: Category): string {
    return this.getPercent(cat) + '%';
  }


  getCatColorClass(cat: Category): string {
    const persent = this.getPercent(cat);
    return persent < 60 ? 'success' : persent >= 100 ? 'danger' : 'warning';
  }


  ngOnDestroy(): void {
    if (this.sub1) this.sub1.unsubscribe();
  }

}
