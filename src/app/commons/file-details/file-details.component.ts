import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { ShareFileModalComponent } from 'src/app/folder/share-file-modal/share-file-modal.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DeleteConfirmModalComponent } from '../delete-confirm-modal/delete-confirm-modal.component';

@Component({
  selector: 'app-file-details',
  templateUrl: './file-details.component.html',
  styleUrls: ['./file-details.component.scss']
})
export class FileDetailsComponent implements OnInit {
  @Input('details') recievedFile;
  createdAt: any;
  totalFiles: any;
  lastUpdate: any;
  title: any;
  displaySaveBtn: boolean = false;
  id: any;
  constructor(public dialog: MatDialog, public _snackBar: MatSnackBar) { }

  ngOnInit() {
    console.log(this.recievedFile)
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.displaySaveBtn = false
    console.log("CHANGES",changes);
    this.createdAt = changes.recievedFile.currentValue.createdAt;
    this.totalFiles = changes.recievedFile.currentValue.files.length;
    this.lastUpdate = changes.recievedFile.currentValue.updatedAt;
    this.title = changes.recievedFile.currentValue.title;
    this.id = changes.recievedFile.currentValue._id;
  }
  showSaveBtn(){
    this.displaySaveBtn = true;
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
  shareWith() {
    console.log("ShareWith");
    this.openDialog(ShareFileModalComponent).subscribe(users => {
      if(users == undefined) return
      console.log('Users', users);
      users.file = this.id;
      users.type = 'folder'
      console.log("AFTER ADDING ID", users);
      this.openSnackBar("Shared Successfully", "ok")
    })
  }
  delete(){
    this.openDialog(DeleteConfirmModalComponent).subscribe(confirm =>{
      if (confirm == '') return
      else if (confirm == 'yes'){
        console.log("DELETED");
        // API PENDING
      }
    })
  }

  saveFolder(){
    let update = {
      title: this.title,
      id : this.id
    }
    console.log("UPDATE", update);
    
    // API CALL PENDING FOR SAVING CHANGED FOLDER TITLE
  }
}
