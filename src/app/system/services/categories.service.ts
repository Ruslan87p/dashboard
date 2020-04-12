import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Category} from '../../shared/models/category.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(public http: HttpClient) { }

  addCategory(category: Category): Observable<any> {
    return this.http.post('http://localhost:3000/categories', category);
      // .pipe(map((response: Response) => {
      //   return response;
      // }));
  }

  getCategories(): Observable<any> {
    return this.http.get('http://localhost:3000/categories');
  }


  updateCategory(category: Category): Observable<any> {
    return this.http.put(`http://localhost:3000/categories/${category.id}`, category);
  }


  getCategoryById(id: number): Observable<any> {
    return this.http.get(`http://localhost:3000/categories/${id}`);
  }
}
