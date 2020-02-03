import {
  Component, OnInit, Input, SimpleChanges, ChangeDetectorRef,
  ChangeDetectionStrategy,
  Output,
  EventEmitter} from '@angular/core';
import { Observable } from 'rxjs';
import { ShareFileModalComponent } from 'src/app/folder/share-file-modal/share-file-modal.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DeleteConfirmModalComponent } from '../delete-confirm-modal/delete-confirm-modal.component';
import { FolderService } from '../../services/folder.service';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-file-details',
  templateUrl: './file-details.component.html',
  styleUrls: ['./file-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileDetailsComponent implements OnInit {
  @Input('details') recievedFile;
  @Output() fileDeleted: EventEmitter<any> = new EventEmitter<any>();
  createdAt: any;
  totalFiles: any;
  lastUpdate: any;
  title: any;
  displaySaveBtn: boolean = false;
  id: any;
  sharedClient: any;
  sharedInstructor: any;
  isMaterials:  String ;
  path: any;
  readOnlyTitle: boolean = true;
  type: any;
  constructor(public _folderService: FolderService, public _fileService : FileService,
    public dialog: MatDialog, public _snackBar: MatSnackBar, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    console.log(this.recievedFile)
    console.log("this.recievedFile in file-details", this.recievedFile);
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.sharedClient = []
    this.sharedInstructor = []
    
    this.displaySaveBtn = false
    console.log("CHANGES", changes);
    if (changes.recievedFile.currentValue) {
      // TYPE
      if (changes.recievedFile.currentValue.type == 'material') this.isMaterials = 'material'; else this.isMaterials = 'not material'
      if (changes.recievedFile.currentValue.type == 'folder') this.readOnlyTitle = false; else this.readOnlyTitle = true;
      this.type = changes.recievedFile.currentValue.type;
      // else this.isMaterials = 'file'
      
      // DATES
      this.createdAt = changes.recievedFile.currentValue.createdAt;
      this.lastUpdate = changes.recievedFile.currentValue.updatedAt;

      // PATH
      this.path = changes.recievedFile.currentValue.path;
      
      // TITLE
      this.title = changes.recievedFile.currentValue.title;
      // ID
      this.id = changes.recievedFile.currentValue._id;

      // SHARED WITH sharedClient
      if(changes.recievedFile.currentValue.sharedClient != undefined){
        if (changes.recievedFile.currentValue.sharedClient.length > 0){
          this.sharedClient = changes.recievedFile.currentValue.sharedClient;
        }
      }

      // SHARED WITH sharedInstructor
      if (changes.recievedFile.currentValue.sharedInstructor != undefined) {
        if (changes.recievedFile.currentValue.sharedInstructor.length > 0){
          this.sharedInstructor = changes.recievedFile.currentValue.sharedInstructor;
        }
      }
    }
  }
  showSaveBtn() {
    if (this.type == 'folder') this.displaySaveBtn = true; else this.displaySaveBtn = false;
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
      this.sharedClient = users.selectedClients;
      this.sharedInstructor = users.selectedInstructors;
      // users.file = this.id;
      this.openSnackBar("Shared Successfully", "ok")
    })
  }
  delete() {
    let update = {
      title: this.title,
      id: this.id
    }
    console.log('File Delete Here:::', this.id);
    this.openDialog(DeleteConfirmModalComponent, this.type).subscribe(confirm => {
      console.log("this.type in delete", this.type);
      if (confirm == '') return
      else if (confirm == 'yes') {
        if(this.type == 'folder'){
          this._folderService.deleteFolder(this.id).subscribe(res => {
          console.log("res", res);
        })
        }
      else if(this.type == 'material'){
          this._fileService.deleteFiles(this.id).subscribe(res=>{
            console.log("MATERIAL DELETED", res);
          })
      }
      this.fileDeleted.emit({ fileId: this.id })
      //   console.log("DELETED");
      //   this.openSnackBar("Deleted Successfully", "ok")
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
