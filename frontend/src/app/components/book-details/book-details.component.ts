import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder} from '@angular/forms';
import {BookService} from '../../services/book.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as _ from 'lodash';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: []
})
export class BookDetailsComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private bookService: BookService,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<any>
  ) {
  }

  editMode = this.data.isEdit;
  bookForm;

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };

  openSnackBar(data) {
    this._snackBar.open(data.message, data.action, {
      duration: 2000
    });
  }

  ngOnInit(): void {
    this.bookForm = this.fb.group({
      id: [],
      title: [],
      description: [],
      publish_date: [],
      authors: []
    });
    if (this.data.isEdit) {
      this.bookForm.patchValue({
        id: this.data.book._id,
        title: this.data.book.title,
        description: this.data.book.description,
        publish_date: this.data.book.publish_date,
        authors: this.data.book.authors
      });
    }
  }

  editBook(book) {
    let self = this;
    book._id = book.id;
    delete(book.id);
    let newBody = {};
    _.reduce(book, function(result, value, key) {
      return _.isEqual(value, self.data.book[key]) ? result : newBody[key] = value;
    }, []);

    newBody['_id'] = book._id;
    this.bookService.updateBook(newBody).then( result => {
      this.dialogRef.close();
      this.openSnackBar(result);
    });

  }

  createBook(book) {
    this.bookService.createBook(book).then(data => {
      this.dialogRef.close();
      this.openSnackBar(data);
    });
  }

  cleanForm() {
    this.bookForm.reset();
  }

}
