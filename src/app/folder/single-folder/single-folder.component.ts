import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { AddFileModalComponent } from '../../files/add-file-modal/add-file-modal.component';
import { MatDialog, MatSnackBar, MatSidenav } from '@angular/material';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FolderService } from '../../services/folder.service';
import * as  JSZip from 'jszip';
import * as JSZipUtil from 'jszip-utils'
import { saveAs } from "file-saver";
import * as _ from 'lodash';
import { ShareFileModalComponent } from '../share-file-modal/share-file-modal.component';
import { ContextMenuComponent } from "ngx-contextmenu";
import { FilterService } from '../../services/filter.service'
import { CreateFolderModalComponent } from '../create-folder-modal/create-folder-modal.component';
// import { $ } from 'protractor';
declare var $: any;
import { NewFileModalComponent } from '../../files/new-file-modal/new-file-modal.component'
JSZip.support.nodebuffer = false;





@Component({
  selector: 'app-single-folder',
  templateUrl: './single-folder.component.html',
  styleUrls: ['./single-folder.component.scss']
})

export class SingleFolderComponent implements OnInit {

  @ViewChild(ContextMenuComponent, { static: false }) public basicMenu: ContextMenuComponent;
  @ViewChild('sidenav', { static: false }) public mydsidenav: MatSidenav;
  @Output() titleChanged: EventEmitter<any> = new EventEmitter<any>();
  filesToDisplay: any;
  allFolders = [];
  preventSingleClick: boolean;
  bgColors;
  lastColor;
  subFolders = [];
  details: any;
  display: boolean;
  navArray: any;
  fileTitle: any;
  fileId: any;
  type: any;
  updatedFolder: any;
  constructor(private router: Router, public _folderService: FolderService, private activatedRoute: ActivatedRoute,
    public dialog: MatDialog, public _snackBar: MatSnackBar, public _filterService: FilterService) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.bgColors = ["bg-info", "bg-success", "bg-warning", "bg-primary", "bg-danger"];
  }
  folderId;
  fileList;
  folder;
  loading;
  loadingMaterials;
  searchText;
  timer: any;
  delay: Number;


  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      console.log(params['id']);
      this.folderId = params['id'];
      console.log(' this.folderId', this.folderId);
    });
    this.getFolderFiles();
  }

  addFileModal() {
    var addedCourse = this.openDialog(NewFileModalComponent, { folderId: this.folderId }).subscribe((courses) => {
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

  filter() {
    if (this.searchText == '') {
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
    this._folderService.getFolder(this.folderId).subscribe((data) => {
      console.log('folder:::::::::', data);
      this.folder = data.folders[0];
      this.subFolders = this.folder.child;

      console.log('This.SubFolder:::::::::', this.folder.child);
      this.fileList = data.folders[0].files;
      this.filesToDisplay = this.fileList;
      // this.subFolders = this.folder.child
      if (data.preFolders != undefined) {
        this.navArray = data.preFolders.reverse();
      }
      console.log("this.folder.child", this.folder.child.reverse());
      console.log("this.subFolders.reverse", this.subFolders.reverse());

    })
  }

  downloadAll() {
    this.loading = true;
    let tempFolder = this.folder.title
    let tempFileList = this.fileList


  
    let zip: JSZip = new JSZip();
    var zipFilename = tempFolder + '.zip';
    let count = 0;
    let myZip;

    new JSZip.external.Promise(function (resolve, reject) {
      console.log('Download all clicked');
      
      _.forEach(tempFileList, (file) => {
        var filename = file.path.split("/")[3];
        // loading a file and add it in a zip file
        JSZipUtil.getBinaryContent(file.path, {
          callback: function (err, data) {
            if (err) {
              reject(err);
            } else {
              zip.file(filename, data, { binary: true });
              count++;
              if (count == tempFileList.length) {
                zip.generateAsync({ type: 'blob' }).then(function (content) {
                  saveAs(content, zipFilename);
                });
                // this.loading = false;
              } else {

              }
              resolve(data)
            }
          },
          progress: function (e) { 
            this.percentage = e.percent
            // console.log("*****PROGRESS",e); 
          }
        });
      });
    }).then((data) => {
      console.log("data in .then", data);
      // return JSZip.loadAsync(data);
    })
  }
  // <---------------OLD FUNCTION START------------------>
  // downloadAll() {

  //   console.log('Download all clicked');

  //   this.loading = true;

  //   let zip: JSZip = new JSZip();
  //   let count = 0;
  //   var zipFilename = this.folder.title + '.zip';


  //   _.forEach(this.fileList, (file) => {
  //     var filename = file.path.split("/")[3];
  //     // loading a file and add it in a zip file
  //     JSZipUtil.getBinaryContent(file.path, (err, data) => {
  //       if (err) {
  //         throw err; // or handle the error
  //       }
  //       zip.file(filename, data, { binary: true });
  //       count++;

  //       if (count == this.fileList.length) {
  //         zip.generateAsync({ type: 'blob' }).then(function (content) {
  //           saveAs(content, zipFilename);
  //         });
  //         this.loading = false;
  //       }
  //     });
  //   });
  // }
// <---------------OLD FUNCTION END------------------>
  
  createFolder() {
    this.openDialog(CreateFolderModalComponent, this.folderId).subscribe(folder => {
      if (folder == undefined) return
      console.log("FOLDER NAME RECIEVED", folder);
      this.subFolders.push(folder);
    })
  }
  showFiles(folderId) {
    console.log("FOLDER", folderId);

    // this.router.navigate(['/single-folder', folderId])
  }
  openFileDetails(event) {
    console.log("IN MY DOCS", event);
    $('.expansion-row').addClass('drawer-col-class');
    $('.flex_row').addClass('flex_reverse');
    // $('.col-md-8').addClass('col-md-12');
    if (event.file != undefined) {
      this.details = event.file;
      this.fileTitle = this.details.alias ? this.details.alias : this.details.title
      this.fileId = this.details._id
      this.type = event.file.type
    }
    else {
      this.details = event
      this.fileTitle = this.details.alias ? this.details.alias : this.details.title
      this.fileId = this.details._id
      this.type = event.type
    }
    this.mydsidenav.open()
  }
  fileDeleted(event) {
    console.log("In singleFolder", event);
    if (event.type == 'folder') {
      var index = _.findIndex(this.subFolders, function (o) {
        console.log("o._id", o, "event.fileId", event.fileId);
        return o._id == event.fileId.toString();
      })
      if (index > -1) this.subFolders.splice(index, 1)
    }
    else if (event.type == 'file') {
      var index = _.findIndex(this.folder.files, function (o) {
        console.log("o._id", o, "event.fileId", event.fileId);
        return o._id == event.fileId.toString();
      })
      if (index > -1) this.folder.files.splice(index, 1)
    }
    this.mydsidenav.close();
    // this.subFolders
  }
  folderTitleChenged(event) {
    console.log("Title changed event in folder", event);
    this.fileTitle = event.alias
    this.updatedFolder = event;
    // this.titleChanged.emit(event)
  }
  getRandomColorClass(i) {
    var rand = Math.floor(Math.random() * this.bgColors.length);
    rand = i % 5;
    this.lastColor = rand;
    return this.bgColors[rand];
  }
  // doubleClick(event, singleFolder) {
  //   console.log("Double Click Event", event);
  //   this.preventSingleClick = true;
  //   clearTimeout(this.timer);
  //   console.log("Double Click");
  //   console.log("singleFolder", singleFolder);
  //   let id = singleFolder._id;
  //   this.router.navigate(['/single-folder', singleFolder._id])
  // }
  singleClick(event, singleFolder) {
    console.log("Single Click Event", event);
    this.preventSingleClick = false;
    const delay = 200;
    this.timer = setTimeout(() => {
      if (!this.preventSingleClick) {
        this.details = singleFolder;
        console.log("singleFolder", this.details);
        this.display = true;
      }
    }, delay);
    this.openFileDetails(singleFolder)
  }
  closeSidenav() {
    this.mydsidenav.close()
    $('.expansion-row').removeClass('drawer-col-class');
    $('.flex_row').removeClass('flex_reverse');
    $('.col-md-8').removeClass('col-md-12');
    $('.parent_row').removeClass('col-width-class');
  }
}
