import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material'
import { Observable } from 'rxjs';
import { CreateFolderModalComponent } from './create-folder-modal/create-folder-modal.component'

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent implements OnInit {

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
  
  createFolder(){
    this.openDialog(CreateFolderModalComponent).subscribe(folder=>{
    })
  }

}
