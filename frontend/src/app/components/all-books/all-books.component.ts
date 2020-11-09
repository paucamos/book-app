import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {BookService} from '../../services/book.service';
import {Subscription} from 'rxjs';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
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
export class AllBooksComponent implements OnInit, OnDestroy, AfterViewInit {

  // Subscriptions
  private subscription: Subscription;
  private logsSubscription: Subscription;
  private logsNodeSubscription: Subscription;

  // Table columns
  displayedColumns: string[] = ['title', 'description', 'publish_date', 'authors', 'actions'];
  displayedChangesColumns: string[] = ['change', 'date'];

  // Table data
  dataSource: MatTableDataSource<any>;
  changesDataSource: MatTableDataSource<any>;
  nodeDataSource: MatTableDataSource<any>;

  // Paginator
  @ViewChild('firstPaginator', {static: true}) firstPaginator: MatPaginator;
  @ViewChild('secondPaginator', {static: true}) secondPaginator: MatPaginator;
  @ViewChild('thirdPaginator', {static: false}) thirdPaginator: MatPaginator;

  // Sort
  // TODO:: Sort second table
  @ViewChild('firstTableSort') firstTableSort: MatSort;
  @ViewChild('secondTableSort') secondTableSort: MatSort;
  @ViewChild('thirdTableSort') thirdTableSort: MatSort;

  // Custom pagination
  pageIndex:number;
  pageSize:number;
  length:number;

  // MatPaginator Output
  pageEvent: PageEvent;

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
        this.dataSource = new MatTableDataSource(<any>books);
        this.dataSource.sort = this.firstTableSort;
        this.dataSource.paginator = this.firstPaginator;
      });
  }

  getChanges(): void {
    this.logsSubscription = this.logsService.getAllLogs()
      .subscribe(logs => {
        this.changesDataSource = new MatTableDataSource(<any>logs);
        this.changesDataSource.sort = this.secondTableSort;
        this.changesDataSource.paginator = this.secondPaginator;
      });
  }

  public getChangesNode(event?): PageEvent {
    this.logsNodeSubscription = this.logsService.getAllPaginatedLogs(event)
      .subscribe(response => {
          if(response['error']) {
            // handle error
          } else {
            this.nodeDataSource = response['logs'];
            this.pageIndex = response['pageIndex'];
            this.length = response['length'];
          }
        },
        error =>{
          // handle error
        }
      );
    return event;
  }

  // Hide ID Changes from Mongo
  getCustomLogs(logs) {
    return _.filter(logs['logs'], function(o) { return !o.action.toLowerCase().includes("id")});
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.logsSubscription.unsubscribe();
    this.logsNodeSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.getChangesNode(null);
  }

  ngAfterViewInit(): void {
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
