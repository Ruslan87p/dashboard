import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Category} from '../../../shared/models/category.model';
import {CategoriesService} from '../../services/categories.service';
import {Message} from '../../../shared/models/message.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy {

  @Input() categories: Category[] = [];
  @Output() onCategoryEdit = new EventEmitter<Category>();

  currentCategoryId = 1;
  currentCategory: Category;
  message: Message;
  sub1: Subscription;

  constructor(private categoriesSvc: CategoriesService) { }

  ngOnInit() {

    this.message = new Message('success', '');
    this.onCategoryChange();
  }


  onCategoryChange() {
    this.currentCategory = this.categories
      .find(c => c.id === +this.currentCategoryId);
  }


  onSubmit(form: NgForm) {
    let {name, capacity} = form.value;
    if (capacity < 0) capacity *= -1;

    const category = new Category(name, capacity, +this.currentCategoryId);

    this.sub1 = this.categoriesSvc.updateCategory(category)
      .subscribe((category: Category) => {
        this.onCategoryEdit.emit(category);

        this.message.text = 'category successfully edited';
        window.setTimeout(() => this.message.text = '', 5000);
      });
  }

  ngOnDestroy(): void {
    if (this.sub1) this.sub1.unsubscribe();
  }

}
