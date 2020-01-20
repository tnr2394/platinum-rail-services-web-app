import { Component, OnInit } from '@angular/core';
import { AddFileModalComponent } from '../../files/add-file-modal/add-file-modal.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FolderService } from '../../services/folder.service';
import * as  JSZip from 'jszip';
import * as JSZipUtil from 'jszip-utils'
import { saveAs } from "file-saver";
import * as _ from 'lodash';



@Component({
  selector: 'app-single-folder',
  templateUrl: './single-folder.component.html',
  styleUrls: ['./single-folder.component.scss']
})

export class SingleFolderComponent implements OnInit {

  constructor(public _folderService: FolderService, private activatedRoute: ActivatedRoute, public dialog: MatDialog) { }
  folderId;
  fileList;
  folder;
  loading;
  loadingMaterials;

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
