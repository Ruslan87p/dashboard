import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {WFMEvent} from '../shared/models/event.model';

@Injectable({
  providedIn: 'root'
})

export class EventsService {
  constructor(public http: HttpClient) {}

  addEvent(event: WFMEvent): Observable<any> {
    return this.http.post('http://localhost:3000/events', event);
  }

  getEvents(): Observable<any> {
    return this.http.get('http://localhost:3000/events');
  }

  getEventById(id: string): Observable<any> {
    return this.http.get(`http://localhost:3000/events/${id}`);
  }
}
