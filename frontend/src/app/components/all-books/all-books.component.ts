import {Component, OnDestroy, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {BookService} from '../../services/book.service';
import {Subscription} from 'rxjs';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {BookDetailsComponent} from '../book-details/book-details.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LogsService} from '../../services/logs.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-all-books',
  templateUrl: './all-books.component.html',
  styleUrls: []
})
export class AllBooksComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  private logsSubscription: Subscription;

  // Table columns
  displayedColumns: string[] = ['title', 'description', 'publish_date', 'authors', 'actions'];
  displayedChangesColumns: string[] = ['change', 'date'];

  // Table data
  dataSource: MatTableDataSource<any>;
  changesDataSource: MatTableDataSource<any>;

  // Paginator
  @ViewChild('firstPaginator', {static: true}) firstPaginator: MatPaginator;
  @ViewChild('secondPaginator', {static: true}) secondPaginator: MatPaginator;

  // TODO:: Sort
  @ViewChild('firstTableSort') firstTableSort: MatSort;
  @ViewChild('secondTableSort') secondTableSort: MatSort;

  constructor(
    private bookService: BookService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private logsService: LogsService
  ) {
    this.getBooks();
    this.getChanges();
  }

  getBooks(): void {
    this.subscription = this.bookService.getAllBooks()
      .subscribe(books => {
        this.dataSource = new MatTableDataSource(books);
        this.dataSource.sort = this.firstTableSort;
        this.dataSource.paginator = this.firstPaginator;
      });
  }

  getChanges(): void {
    this.logsSubscription = this.logsService.getAllLogs()
      .subscribe(logs => {
        // Hide ID Changes from Mongo
        logs = _.filter(logs, function(o) { return !o.action.toLowerCase().includes("id")});

        this.changesDataSource = new MatTableDataSource(logs);
        this.changesDataSource.sort = this.secondTableSort;
        this.changesDataSource.paginator = this.secondPaginator;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.logsSubscription.unsubscribe();
  }

  ngOnInit(): void {
  }

  bookDetails(isEdit = false, book = null) {
    this.dialog.open(BookDetailsComponent, {
      height: 'auto',
      maxHeight: '700px',
      width: '550px',
      panelClass: ['dialog-custom-color'],
      data: {isEdit, book},
      autoFocus: false
    }).afterClosed().subscribe(() => {
      this.getBooks();
      this.getChanges();
    });
  }

  deleteBook(book: any) {
    this.bookService.deleteBook(book._id).then(data => {
      this._snackBar.open(data['message'], data['action'], {
        duration: 2000
      });
      this.getBooks();
      this.getChanges();
    });
  }

  applyBookFilter(event: KeyboardEvent, type) {
      const filterValue = (event.target as HTMLInputElement).value;
      if (type == 'book') {
        this.dataSource.filter = filterValue.trim().toLowerCase();
      } else {
        this.changesDataSource.filter = filterValue.trim().toLowerCase();
      }
  }
}
