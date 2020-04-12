import {Component, EventEmitter, OnDestroy, Output} from '@angular/core';
import {NgForm} from '@angular/forms';
import {CategoriesService} from '../../services/categories.service';
import {Category} from '../../../shared/models/category.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})

export class AddCategoryComponent implements OnDestroy {

  @Output() onCategoryAdd = new EventEmitter<Category>();
  sub1: Subscription;

  constructor(private categoriesSvc: CategoriesService) { }


  onSubmit(form: NgForm) {
    let {name, capacity} = form.value;
    if (capacity < 0) capacity *= -1;
    // console.log(form.value);

    const category = new Category(name, capacity);

    this.sub1 = this.categoriesSvc.addCategory(category)
      .subscribe((category: Category) => {
        form.reset();
        form.form.patchValue({capacity: 1});
        this.onCategoryAdd.emit(category);
      });
  }

  ngOnDestroy(): void {
    if (this.sub1) this.sub1.unsubscribe();
  }

}
