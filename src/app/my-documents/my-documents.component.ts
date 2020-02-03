import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog, MatSnackBar, MatSidenav } from '@angular/material'
import { ShareFileModalComponent } from '../folder/share-file-modal/share-file-modal.component';

@Component({
  selector: 'app-my-documents',
  templateUrl: './my-documents.component.html',
  styleUrls: ['./my-documents.component.scss']
})
export class MyDocumentsComponent implements OnInit {
  details: any;
  @ViewChild('sidenav', { static: false }) public mydsidenav: MatSidenav;
  deletedFile: any;
  constructor(public dialog: MatDialog, public _snackBar: MatSnackBar) { }
  ngOnInit() {
  }

  openDialog(someComponent, data = {}): Observable<any> {
    console.log("OPENDIALOG", "DATA = ", data);
    const dialogRef = this.dialog.open(someComponent, { data, width: '500px', height: '600px' });
    return dialogRef.afterClosed();
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  openFileDetails(event){
    console.log("IN MY DOCS", event);
    if(event.file != undefined){
      this.details = event.file;
    }
    else{
      this.details = event
    }
    this.mydsidenav.open()
  }
  fileDeleted(event){
    console.log("In My Documents", event);
    this.deletedFile = event;
  }
}
