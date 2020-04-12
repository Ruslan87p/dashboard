import {Component, OnDestroy, OnInit} from '@angular/core';
import {CategoriesService} from '../services/categories.service';
import {EventsService} from '../services/events.service';
import {combineLatest, Subscription} from 'rxjs';
import {Category} from '../../shared/models/category.model';
import {WFMEvent} from '../shared/models/event.model';
import * as moment from 'moment';


@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements OnInit, OnDestroy {

  sub1: Subscription;
  categories: Category[] = [];
  events: WFMEvent[] = [];
  isLoaded = false;
  isFilterVisible = false;
  filteredEvents: WFMEvent[] = [];
  chartData = [];

  constructor(private categoriesSvc: CategoriesService,
              private eventsSvc: EventsService) { }

  ngOnInit() {
    this.sub1 = combineLatest(
      this.categoriesSvc.getCategories(),
      this.eventsSvc.getEvents()
    ).subscribe((data: [Category[], WFMEvent[]]) => {
        this.categories = data[0];
        this.events = data[1];

        this.setOriginalEvents();
        this.calculateChartData();

        this.isLoaded = true;
    });
  }

  private setOriginalEvents() {
    // call method slice to copy array;
    this.filteredEvents = this.events.slice();
  }

  calculateChartData(): void {
    this.chartData = [];
    this.categories.forEach((cat) => {
      const catEvent = this.filteredEvents.filter((e) => e.category === cat.id && e.type === 'outcome');

      this.chartData.push({
        name: cat.name,
        value: catEvent.reduce((total, e) => {
          total += e.amount;
          return total;
        }, 0)
      });

    });
  }


  private toggleFilterVisibility(dir: boolean) {
    this.isFilterVisible = dir;
  }

  openFilter() {
    this.toggleFilterVisibility(true);
  }


  onFilterApply(filterData) {
    this.toggleFilterVisibility(false);
    this.setOriginalEvents();

    const startPeriod = moment().startOf(filterData.period).startOf('d');
    const endPeriod = moment().endOf(filterData.period).endOf('d');

    this.filteredEvents = this.filteredEvents
      .filter((e) => {
        return filterData.types.indexOf(e.type) !== -1;
      })
      .filter((e) => {
        return filterData.categories.indexOf(e.category.toString()) !== -1;
      })
      .filter((e) => {
        const momentDate = moment(e.date, 'DD.MM.YYYY HH:mm:ss');
        return momentDate.isBetween(startPeriod, endPeriod);
      });

    this.calculateChartData();
  }


  onFilterCancel() {
    this.toggleFilterVisibility(false);
    this.setOriginalEvents();
    this.calculateChartData();
  }



  ngOnDestroy(): void {
    if (this.sub1) this.sub1.unsubscribe();
  }
}
