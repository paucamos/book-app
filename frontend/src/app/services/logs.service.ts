import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LogsService {

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {
  }

  getAllLogs() {
    return this.http.get(`${this.baseUrl}/logs`);
  }
}
