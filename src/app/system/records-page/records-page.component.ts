import { Component, OnInit } from '@angular/core';
import {Category} from '../../shared/models/category.model';
import {CategoriesService} from '../services/categories.service';

@Component({
  selector: 'app-records-page',
  templateUrl: './records-page.component.html',
  styleUrls: ['./records-page.component.css']
})

export class RecordsPageComponent implements OnInit {

  categories: Category[] = [];
  isLoaded = false;

  constructor(private categorySvc: CategoriesService) { }

  ngOnInit() {
    this.categorySvc.getCategories()
      .subscribe((categories: Category[]) => {
        this.categories = categories;
        this.isLoaded = true;
      });
  }

  newCategoryAdded(category: Category) {
    this.categories.push(category);
  }

  categoryWasEdited(category: Category) {
    const indx = this.categories
      .findIndex(c => c.id === category.id);
    this.categories[indx] = category;
  }

}
