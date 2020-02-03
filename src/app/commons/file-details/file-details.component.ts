import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { ShareFileModalComponent } from 'src/app/folder/share-file-modal/share-file-modal.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DeleteConfirmModalComponent } from '../delete-confirm-modal/delete-confirm-modal.component';
import { FolderService } from '../../services/folder.service';

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
  constructor(public _folderService: FolderService, public dialog: MatDialog, public _snackBar: MatSnackBar) { }

  ngOnInit() {
    console.log(this.recievedFile)
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.displaySaveBtn = false
    console.log("CHANGES", changes);
    if (changes.recievedFile.currentValue != undefined) {
      this.createdAt = changes.recievedFile.currentValue.createdAt;
      // this.totalFiles = changes.recievedFile.currentValue.files.length;
      this.lastUpdate = changes.recievedFile.currentValue.updatedAt;
      this.title = changes.recievedFile.currentValue.title;
      this.id = changes.recievedFile.currentValue._id;
    }
  }
  showSaveBtn() {
    this.displaySaveBtn = true;
  }

  openDialog(someComponent, data = {}): Observable<any> {
    data = this.recievedFile
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
    console.log("this.recievedFiles", this.recievedFile);
    this.openDialog(ShareFileModalComponent).subscribe(users => {
      if (users == undefined) return
      console.log('Users', users);
      users.file = this.id;
      if (this.recievedFile.child == undefined) {
        console.log("in if, hence a file");

        this._folderService.shareFile(users).subscribe(res => {

        })
      }
      else {
        console.log("A folder");

        console.log("AFTER ADDING ID", users);
        this._folderService.shareFolder(users).subscribe(res => {

        })
      }
      this.openSnackBar("Shared Successfully", "ok")
    })
  }
  delete() {
    let update = {
      title: this.title,
      id: this.id
    }

    console.log('File Delete Here:::', this.id);

    this.openDialog(DeleteConfirmModalComponent).subscribe(confirm => {
      if (confirm == '') return
      else if (confirm == 'yes') {
        console.log("DELETED");
        // API PENDING
        this._folderService.deleteFolder(this.id).subscribe(res => {

        })
        this.openSnackBar("Deleted Successfully", "ok")
      }
    })
  }

  saveFolder() {
    let update = {
      title: this.title,
      id: this.id
    }
    console.log("UPDATE", update);

    this._folderService.editFolder(update).subscribe(res => {

    })
    this.openSnackBar("Updated Successfully", "ok")
    // API CALL PENDING FOR SAVING CHANGED FOLDER TITLE
  }
}
