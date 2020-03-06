import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { NewFileModalComponent } from 'src/app/files/new-file-modal/new-file-modal.component';

@Component({
  selector: 'app-add-comp-modal',
  templateUrl: './add-comp-modal.component.html',
  styleUrls: ['./add-comp-modal.component.scss']
})
export class AddCompModalComponent implements OnInit {

  title;
  expiryDate;

  constructor(public dialogRef: MatDialogRef<AddCompModalComponent>, public dialog: MatDialog, public _snackBar: MatSnackBar) { }

  ngOnInit() {
  }
  cancle(){
    this.dialogRef.close()
  }
  submit(){
    console.log("title", this.title, "x-date", this.expiryDate);
    if (this.title && this.expiryDate){
      let data = {
        title: this.title,
        xDate: this.expiryDate
      }
      this.dialogRef.close(data)
    }
    else {
      this.openSnackBar("Title and Expiry Date are required","OK");
    }
  }

  openDialog(someComponent, data = {}): Observable<any> {
    console.log('OPENDIALOG', 'DATA = ', data)
    const dialogRef = this.dialog.open(someComponent, { data, width: '1000px', height: '967px' });

    return dialogRef.afterClosed();
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
