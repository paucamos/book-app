import {Component, OnDestroy, OnInit} from '@angular/core';
import {BookService} from '../../services/book.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-all-books',
  templateUrl: './all-books.component.html',
  styleUrls: []
})
export class AllBooksComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  public allBooks;

  constructor(
    private bookService: BookService
  ) {
  }

  ngOnInit(): void {
    this.getBooks();
  }

  getBooks() {
    this.subscription = this.bookService.getAllBooks().subscribe( books => {
      this.allBooks = books;
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


}
