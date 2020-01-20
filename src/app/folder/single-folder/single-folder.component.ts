import { Component, OnInit, ViewChild } from '@angular/core';
import { AddFileModalComponent } from '../../files/add-file-modal/add-file-modal.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FolderService } from '../../services/folder.service';
import * as  JSZip from 'jszip';
import * as JSZipUtil from 'jszip-utils'
import { saveAs } from "file-saver";
import * as _ from 'lodash';
import { ShareFileModalComponent } from '../share-file-modal/share-file-modal.component';
import { ContextMenuComponent } from "ngx-contextmenu";
import { FilterService } from '../../services/filter.service'




@Component({
  selector: 'app-single-folder',
  templateUrl: './single-folder.component.html',
  styleUrls: ['./single-folder.component.scss']
})

export class SingleFolderComponent implements OnInit {

  @ViewChild(ContextMenuComponent, { static: false }) public basicMenu: ContextMenuComponent;
  filesToDisplay: any;
  constructor(public _folderService: FolderService, private activatedRoute: ActivatedRoute, 
    public dialog: MatDialog, public _snackBar: MatSnackBar, public _filterService: FilterService) { }
  folderId;
  fileList;
  folder;
  loading;
  loadingMaterials;
  searchText;

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      console.log(params['id']);
      this.folderId = params['id'];
    });
    this.getFolderFiles();
  }

  addFileModal() {
    var addedCourse = this.openDialog(AddFileModalComponent, { folderId: this.folderId }).subscribe((courses) => {
      this.getFolderFiles();
    }, err => {
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  shareWith(file) {
    console.log("ShareWith", file);
    this.openDialog(ShareFileModalComponent).subscribe(users => {
      console.log('Users', users);
      users.file = file.item;
      console.log("AFTER ADDING ID", users);
      this.openSnackBar("Shared Successfully", "ok")
    })
  }

  filter(){
    if(this.searchText == ''){
      this.filesToDisplay = this.fileList;
    }
    else {
      this.filesToDisplay = this._filterService.filter(this.searchText, this.fileList, ['title']);
    }
  }

  openDialog(someComponent, data = {}): Observable<any> {
    console.log("OPENDIALOG", "DATA = ", data);
    const dialogRef = this.dialog.open(someComponent, { width: "1000px", data });
    return dialogRef.afterClosed();
  }

  getFolderFiles() {
    this._folderService.getFolder(this.folderId).subscribe((folder) => {
      console.log('folder:::::::::', folder);
      this.folder = folder[0];
      this.fileList = folder[0].files;
      this.filesToDisplay = this.fileList;
      console.log("THis.fileList", this.fileList);
    })
  }

  downloadAll() {

    console.log('Download all clicked');

    this.loading = true;

    let zip: JSZip = new JSZip();
    let count = 0;
    var zipFilename = this.folder.title + '.zip';


    _.forEach(this.fileList, (file) => {
      var filename = file.path.split("/")[3];
      // loading a file and add it in a zip file
      JSZipUtil.getBinaryContent(file.path, (err, data) => {
        if (err) {
          throw err; // or handle the error
        }
        zip.file(filename, data, { binary: true });
        count++;

        if (count == this.fileList.length) {
          zip.generateAsync({ type: 'blob' }).then(function (content) {
            saveAs(content, zipFilename);
          });
          this.loading = false;
        }
      });
    });
  }


}
