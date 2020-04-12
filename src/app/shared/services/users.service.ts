import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {User} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})


export class UsersService {

  constructor(public http: HttpClient) {
  }


  getUserByEmail(formData: string): Observable<any> {
    return this.http.get('http://localhost:3000/users?email=' + formData['email'])
      .pipe(map((item) => {
        // console.log(item[0]);
        return item[0];
      }));
  }

  createNewUser(user: User): Observable<any> {
    return this.http.post('http://localhost:3000/users', user)
      .pipe(map((item) => {
        return item;
      }));
  }

}
