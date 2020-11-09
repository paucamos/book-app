import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {
  }

  getAllBooks() {
    return this.http.get(`${this.baseUrl}/books`);
  }

  createBook(book: any) {
    return this.http.post(`${this.baseUrl}/books/new`, book).toPromise();
  }

  updateBook(book: any) {
    return this.http.patch(`${this.baseUrl}/books/${book._id}`, book).toPromise();
  }

  deleteBook(book: any) {
    return this.http.delete(`${this.baseUrl}/books/${book}`).toPromise();
  }
}
