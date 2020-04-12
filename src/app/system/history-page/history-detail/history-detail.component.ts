import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {EventsService} from '../../services/events.service';
import {CategoriesService} from '../../services/categories.service';
import {mergeMap} from 'rxjs/operators';
import {WFMEvent} from '../../shared/models/event.model';
import {Category} from '../../../shared/models/category.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-history-detail',
  templateUrl: './history-detail.component.html',
  styleUrls: ['./history-detail.component.css']
})
export class HistoryDetailComponent implements OnInit, OnDestroy {

  event: WFMEvent;
  category: Category;
  isLoaded = false;
  sub1: Subscription;

  constructor(private route: ActivatedRoute,
              private eventsSvc: EventsService,
              private categoriesSvc: CategoriesService) { }

  ngOnInit() {
    this.route.params
      .pipe(mergeMap((params: Params) => this.eventsSvc.getEventById(params['id'])))
      .pipe(mergeMap((event: WFMEvent) => {
        this.event = event;
        return this.categoriesSvc.getCategoryById(event.category);
      }))

      .subscribe((category: Category) => {
        this.category = category;
        this.isLoaded = true;
      });
  }


  ngOnDestroy(): void {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
  }

}
