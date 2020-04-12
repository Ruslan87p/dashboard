import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})


export class BillService  {

  constructor(public http: HttpClient) {}


  getBill(): Observable<any> {
    return this.http.get('http://localhost:3000/bill')
      .pipe(map((response: Response) => {
        return response;
      }));
  }

  updateBill(bill: Bill): Observable<any> {
    return this.http.put('http://localhost:3000/bill', bill);
  }


  getCurrency(base: string = 'RUB'): Observable<any> {
    return this.http.get('https://api.exchangeratesapi.io/latest?base=' + base + '')
      .pipe(map((response: Response) => {
        return response;
      }));
  }
}
