import {
  Component, OnInit, Input, SimpleChanges, ChangeDetectorRef,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
} from '@angular/core';
import { Observable } from 'rxjs';
import { ShareFileModalComponent } from 'src/app/folder/share-file-modal/share-file-modal.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DeleteConfirmModalComponent } from '../delete-confirm-modal/delete-confirm-modal.component';
import { FolderService } from '../../services/folder.service';
import { FileService } from 'src/app/services/file.service';
import * as  JSZip from 'jszip';
import * as JSZipUtil from 'jszip-utils'
import { saveAs } from "file-saver";
import * as _ from 'lodash';

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
  loading;
  currentFolder;
  sharedClient: any;
  sharedInstructor: any;
  isMaterials: String;
  path: any;
  readOnlyTitle: boolean = true;
  type: any;
  constructor(public _folderService: FolderService, public _fileService: FileService,
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
      this.currentFolder = changes.recievedFile.currentValue;
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
      if (changes.recievedFile.currentValue.sharedClient != undefined) {
        if (changes.recievedFile.currentValue.sharedClient.length > 0) {
          this.sharedClient = changes.recievedFile.currentValue.sharedClient;
        }
      }

      // SHARED WITH sharedInstructor
      if (changes.recievedFile.currentValue.sharedInstructor != undefined) {
        if (changes.recievedFile.currentValue.sharedInstructor.length > 0) {
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
        if (this.type == 'folder') {
          this._folderService.deleteFolder(this.id).subscribe(res => {
            console.log("res", res);
          })
        }
        else if (this.type == 'material') {
          this._fileService.deleteFiles(this.id).subscribe(res => {
            console.log("MATERIAL DELETED", res);
          })
        }
        else if (this.type == 'file') {
          this._folderService.deleteFile(this.id).subscribe(res => {
            console.log("file DELETED", res);
          })
        }
        this.fileDeleted.emit({ fileId: this.id, type: this.type })
        //   console.log("DELETED");
        //   this.openSnackBar("Deleted Successfully", "ok")
      }
    })
  }

  downloadAll() {

    console.log('Download all clicked', this.currentFolder);

    this.loading = true;


    console.log("this.currentFolder", this.currentFolder._id)

    this._folderService.getFolder(this.currentFolder._id).subscribe(res => {

      let zip: JSZip = new JSZip();
      let count = 0;

      var zipFilename = res.folders.title + '.zip';


      console.log(res.folders);

      if (res.folders[0].files && res.folders[0].files.length) {
        _.forEach(res.folders[0].files, (file) => {
          console.log("file.path", file.path, file)
          var filename = file.path.split("/")[3];
          // loading a file and add it in a zip file
          JSZipUtil.getBinaryContent(file.path, (err, data) => {
            if (err) {
              throw err; // or handle the error
            }
            zip.file(filename, data, { binary: true });
            count++;

            if (count == res.folders[0].files.length) {
              zip.generateAsync({ type: 'blob' }).then(function (content) {
                saveAs(content, zipFilename);
              });
              this.loading = false;
            }
          });
        });
      }
      else {
        alert("No files contais in this folder")
      }

    })




    // console.log("this.currentFolder.files", this.currentFolder.files)
    // this._folderService.getFolder(this.id).subscribe(res=>{

    // })
    // if (this.currentFolder.files && this.currentFolder.files.length){
    //   _.forEach(this.currentFolder.files, (file) => {
    //     console.log("file.path", file.path, file)
    //     var filename = file.path.split("/")[3];
    //     // loading a file and add it in a zip file
    //     JSZipUtil.getBinaryContent(file.path, (err, data) => {
    //       if (err) {
    //         throw err; // or handle the error
    //       }
    //       zip.file(filename, data, { binary: true });
    //       count++;

    //       if (count == this.currentFolder.files.length) {
    //         zip.generateAsync({ type: 'blob' }).then(function (content) {
    //           saveAs(content, zipFilename);
    //         });
    //         this.loading = false;
    //       }
    //     });
    //   });
    // }
    // else{

    // }


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
