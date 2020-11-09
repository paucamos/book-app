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

  // Not working properly
  getAllPaginatedLogs(e) {
    if (!e) {
      e = {
        pageIndex: 1,
        pageSize: 2
      }
    }
    return this.http.get(`${this.baseUrl}/logs/node?page=${e.pageIndex}&limit=${e.pageSize}`);
  }
}
