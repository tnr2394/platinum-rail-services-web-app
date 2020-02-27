import { Component, OnInit, ViewChild, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog, MatSnackBar, MatSidenav } from '@angular/material'
import { ShareFileModalComponent } from '../folder/share-file-modal/share-file-modal.component';
declare var $: any;

@Component({
  selector: 'app-my-documents',
  templateUrl: './my-documents.component.html',
  styleUrls: ['./my-documents.component.scss']
})
export class MyDocumentsComponent implements OnInit {
  details: any;
  @ViewChild('sidenav', { static: false }) public mydsidenav: MatSidenav;
  deletedFile: any;
  removeCssClass: boolean = false;
  fileTitle: any;
  fileId: any;
  type: any;
  updatedFolder: any;
  
  
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
      this.fileTitle = this.details.alias ? this.details.alias : this.details.title
      this.fileId = this.details._id
      this.type = event.file.type
    }
    else{
      this.details = event
      this.fileTitle = this.details.alias ? this.details.alias : this.details.title
      this.fileId = this.details._id
      this.type = event.type
    }
    this.mydsidenav.open()
  }
  fileDeleted(event){
    console.log(" TEST ", event);
    this.deletedFile = event;
  }
  closeSidnav() {
    this.mydsidenav.close()
    // this.removeCssClass = true;
    $('.parent_row').removeClass('col-width-class');
  }
  folderTitleChenged(event) {
    console.log("Title changed event in single-folder", event);
    this.fileTitle = event.title
    this.updatedFolder = event;
    // this.titleChanged.emit(event)
  }
}
