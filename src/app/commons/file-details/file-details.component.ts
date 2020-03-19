import { Component, OnInit, Input, SimpleChanges, ChangeDetectorRef, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
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
import { CompetenciesService } from 'src/app/services/competencies.service';
JSZip.support.nodebuffer = false;
import { Router } from '@angular/router';
// import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-file-details',
  templateUrl: './file-details.component.html',
  styleUrls: ['./file-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileDetailsComponent implements OnInit {
  @Input('details') recievedFile;
  @Input('isCompetency') isCompetency;
  @Input('competencieId') competencieId;
  @Output() fileDeleted: EventEmitter<any> = new EventEmitter<any>();
  @Output() titleChanged: EventEmitter<any> = new EventEmitter<any>();

  createdAt: any;
  totalFiles: any;
  lastUpdate: any;
  title: any;
  displaySaveBtn: boolean = false;
  id: any;
  units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  supportedDocuments = ['doc', 'docx', 'pdf', 'ppt', 'pptx', 'xlsx', 'xls'];
  loading;
  currentFolder;
  sharedClient: any;
  sharedInstructor: any;
  isMaterials: boolean;
  path: any;
  readOnlyTitle: boolean = true;
  supportedDocument: boolean;
  type: any;
  currentUser: any;
  hideActions: boolean = false;
  pathForPreview: string;
  constructor(public _folderService: FolderService, public _fileService: FileService, public _competencyService : CompetenciesService,
    public dialog: MatDialog, public _snackBar: MatSnackBar, private cd: ChangeDetectorRef, public router: Router) { }

  ngOnInit() {
    console.log("On init isCompetency", this.isCompetency);
    console.log(this.recievedFile)
    console.log("this.recievedFile in file-details", this.recievedFile);
    // if(this.isCompetency == true){
    //   this.isMaterials = 'material'
    // }
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if(this.currentUser.userRole == 'client'){
      this.hideActions = true
    }
  }
  ngOnChanges(changes: SimpleChanges): void {

    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if(this.currentUser.userRole == 'client'){
      this.hideActions = true
    }
    this.sharedClient = []
    this.sharedInstructor = []

    this.displaySaveBtn = false
    console.log("CHANGES", changes);
    if (changes.isCompetency && changes.isCompetency.currentValue == true) {
      this.isCompetency = changes.isCompetency.currentValue;
      // this.isMaterials = 'material'
    }
    if (changes.competencieId && changes.competencieId.currentValue){
      this.competencieId = changes.competencieId.currentValue
    }
    // if (changes.isCompetency == undefined){
    //   this.isCompetency = false
    // }
    if (changes.recievedFile.currentValue) {
      this.currentFolder = changes.recievedFile.currentValue;
      // TYPE
      if (changes.recievedFile.currentValue.type == 'material') this.isMaterials = true; else this.isMaterials = false

      if (changes.recievedFile.currentValue.type == 'folder') this.readOnlyTitle = false; else this.readOnlyTitle = true;
      this.type = changes.recievedFile.currentValue.type;
      if (changes.recievedFile.currentValue.path) {
        this.pathForPreview = "https://docs.google.com/gview?url=" + changes.recievedFile.currentValue.path + "&embedded=true"
      }
      // https://docs.google.com/gview?url="+ {{recievedFile.path}} + "&embedded=true"
      // else this.isMaterials = 'file'

      // DATES
      this.createdAt = changes.recievedFile.currentValue.createdAt;
      this.lastUpdate = changes.recievedFile.currentValue.updatedAt;

      // PATH
      this.path = changes.recievedFile.currentValue.path;
      this.supportedDocument = this.supportFilePreview(changes.recievedFile.currentValue.extension);

      // TITLE
      (changes.recievedFile.currentValue.alias) ? this.title = changes.recievedFile.currentValue.alias : this.title = changes.recievedFile.currentValue.title

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

  closeSidenav() {

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
  openFolder(){
    this.router.navigate(['/single-folder', this.recievedFile._id])
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
        else if(this.type == 'competencies') {
          console.log("competenciesId", this.competencieId, "fileId", this.id);
          this._competencyService.deleteFile(this.competencieId,this.id).subscribe(res => {
            console.log("Competency deleted", res);
          })
        }
        this.fileDeleted.emit({ fileId: this.id, type: this.type, competenciesId: this.competencieId })
      }
    })
  }

  downloadAll() {
    console.log('Download all calling', this.currentFolder);

    this.loading = true;
    this._folderService.getFolderWithSubFolder(this.currentFolder._id).subscribe(res => {

      console.log('Res in ts file===>>', res);

      _.forEach(res, (singleFolder) => {
        let zip: JSZip = new JSZip();
        let count = 0;
        var zipFilename = singleFolder.title + '.zip';


        if (singleFolder.files && singleFolder.files.length) {
          _.forEach(singleFolder.files, (file) => {
            console.log("file.path", file.path, file)
            var filename = file.path.split("/")[3];
            // loading a file and add it in a zip file
            JSZipUtil.getBinaryContent(file.path, (err, data) => {
              if (err) {
                throw err; // or handle the error
              }
              zip.file(filename, data, { binary: true });
              count++;

              if (count == singleFolder.files.length) {
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


      //   return;

      //   let zip: JSZip = new JSZip();
      //   let count = 0;
      //   var zipFilename = res.folders.title + '.zip';

      //   if (res.folders[0].files && res.folders[0].files.length) {
      //     _.forEach(res.folders[0].files, (file) => {
      //       console.log("file.path", file.path, file)
      //       var filename = file.path.split("/")[3];
      //       // loading a file and add it in a zip file
      //       JSZipUtil.getBinaryContent(file.path, (err, data) => {
      //         if (err) {
      //           throw err; // or handle the error
      //         }
      //         zip.file(filename, data, { binary: true });
      //         count++;

      //         if (count == res.folders[0].files.length) {
      //           zip.generateAsync({ type: 'blob' }).then(function (content) {
      //             saveAs(content, zipFilename);
      //           });
      //           this.loading = false;
      //         }
      //       });
      //     });
      //   }
      //   else {
      //     alert("No files contais in this folder")
      //   }
      // })
    })
  }

  saveFolder() {
    let update = {
      title: this.title,
      id: this.id
    }
    console.log("UPDATE", update);
    this.recievedFile.title = this.title;
    this._folderService.editFolder(update).subscribe(res => {
      this.titleChanged.emit(this.recievedFile)
    })
    this.openSnackBar("Updated Successfully", "ok")
  }

  convertBytes(x) {
    let l = 0, n = parseInt(x, 10) || 0;
    while (n >= 1024 && ++l) {
      n = n / 1024;
    }
    return (n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + this.units[l]);
  }

  supportFilePreview(type) {
    console.log('File Type Support=====>>>>>>>', type);
    let index = _.findIndex(this.supportedDocuments, function (o) { return o == type; });
    if (index >= 0) {
      return true;
    } else {
      return false;
    }
  }
}
