import { Component, OnInit, ViewChild, Output, EventEmitter, Input, SimpleChanges, ɵSWITCH_CHANGE_DETECTOR_REF_FACTORY__POST_R3__ } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material'
import { Observable } from 'rxjs';
import { CreateFolderModalComponent } from './create-folder-modal/create-folder-modal.component';
import { FolderService } from '../services/folder.service';
import { ContextMenuComponent } from "ngx-contextmenu";
import { ShareFileModalComponent } from './share-file-modal/share-file-modal.component';
import { ok } from 'assert';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
// import { $ } from 'protractor';
declare var $: any;
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent implements OnInit {

  allFolders = [];
  sharedFile = [];
  bgColors;
  lastColor;
  preventSingleClick = false;
  timer: any;
  delay: Number;
  display = false;
  currentUser;

  @ViewChild(ContextMenuComponent, { static: false }) public basicMenu: ContextMenuComponent;
  details: any;
  @Input('deletedFile') deletedFile: any;
  @Input('subFolders') subFolder: any;
  @Input('removeCssClass') removeCssClass: any;
  @Input('updatedFolder') updatedFolder: any;
  @Output() getFileDetails: EventEmitter<any> = new EventEmitter<any>();
  showCreateBtn: boolean = false;
  allFoldersCopy: any[];
  constructor(public _folderService: FolderService, private activatedRoute: ActivatedRoute
    ,public dialog: MatDialog, public _snackBar: MatSnackBar, public router: Router) {
    this.bgColors = ["bg-info", "bg-success", "bg-warning", "bg-primary", "bg-danger"];
  }

  ngOnInit() {
    if (this.router.url.includes('/mydocuments')){
      this.showCreateBtn = true
    }
    // this.currentUser = JSON.parse(localStorage.currentUser);
    // if (this.currentUser.userRole == 'admin') {
    //   this.getFolders();
    // } else {
    //   this.getSharedFolders();
    //   this.getSharedFiles();
    // }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("changes", changes)
    if (changes.deletedFile){
      var index = _.findIndex(this.allFolders, function (o) {
        return o._id.toString() == changes.deletedFile.currentValue.fileId.toString(); 
      })
      if(index > -1) this.allFolders.splice(index, 1)
    }
    if (changes.subFolder){
      console.log("changes.subFolder.currentValue typeof", typeof changes.subFolder.currentValue);
      this.allFolders = changes.subFolder.currentValue;
      console.log("This.allFolders", this.allFolders);
    }
    if (changes.subFolder == undefined && this.router.url.includes('/mydocuments')){
      this.getFolders()
    }
    if (changes.removeCssClass != undefined){
      if (changes.removeCssClass.currentValue == true){
        $('.parent_row').removeClass('col-width-class');
      }
    }
    if (changes.updatedFolder){
      var index = _.findIndex(this.allFolders, function (o) {
        return o._id.toString() == changes.updatedFolder.currentValue._id.toString();
      })
      if(index > -1) this.allFolders.splice(index,1,changes.updatedFolder.currentValue)

      else{
        console.log("this.subFolder", this.subFolder);
        var index = _.findIndex(this.subFolder, function (o) {
          return o._id.toString() == changes.updatedFolder.currentValue._id.toString();
        })
        console.log("Index", index);
        if (index > -1) this.subFolder.splice(index, 1, changes.updatedFolder.currentValue)
      }
      console.log("this.subFolder", this.subFolder);
    }
  }

  getRandomColorClass(i) {
    var rand = Math.floor(Math.random() * this.bgColors.length);
    rand = i % 5;
    this.lastColor = rand;
    return this.bgColors[rand];
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
  // shareWith(singleFolder){
  //   console.log("ShareWith", singleFolder);
  //   this.openDialog(ShareFileModalComponent).subscribe(users=>{
  //     console.log('Users', users);
  //     users.file = singleFolder.item;
  //     console.log("AFTER ADDING ID", users);
  //     this.openSnackBar("Shared Successfully", "ok")
  //   })
  // }

  createFolder() {
    let folderId
    this.activatedRoute.params.subscribe(params => {
      folderId = params['id'];
      console.log("Calling getLearners with jobid = ", folderId);
    });
    this.openDialog(CreateFolderModalComponent, folderId).subscribe(folder => {
      if (folder == undefined) return
      console.log("FOLDER NAME RECIEVED", folder);
      this.allFolders.push(folder);
    })
  }

  getFolders() {
    var that = this;
    this._folderService.getFolders().subscribe((folders) => {
      console.log('Folders', folders);
      this.allFolders = folders;
      this.allFoldersCopy = this.allFolders
    });
  }
  openFileDetails(file){
    console.log("Open file details", file);
    this.getFileDetails.emit(file)
  }

  getSharedFolders() {
    var that = this;
    this._folderService.getSharedFolders().subscribe((folders) => {
      console.log('Folders', folders);
      this.allFolders = folders;
    });
  }

  getSharedFiles() {
    var that = this;
    this._folderService.getSharedFiles().subscribe((files) => {
      console.log('files List', files);
      this.sharedFile = files;
      // this.allFolders = folders;
    });
  }

  singleClick(event, singleFolder,i) {
    console.log("Single Click Event", event);
    // var id = "#folder_card_" + i;
    this.removeCssClass = false
    console.log("this.removeCssClss", this.removeCssClass);
    
    $('.parent_row').addClass('col-width-class');
    this.preventSingleClick = false;
    const delay = 200;
    this.timer = setTimeout(() => {
      if (!this.preventSingleClick) {
        this.details = singleFolder;
        console.log("singleFolder", this.details);
        this.display = true;
      }
    }, delay);
    this.getFileDetails.emit(singleFolder)
   
  }

  doubleClick(event, singleFolder) {
    console.log("Double Click Event", event);
    this.preventSingleClick = true;
    clearTimeout(this.timer);
    console.log("Double Click");
    console.log("singleFolder", singleFolder);
    let id = singleFolder._id;
    this.router.navigate(['/single-folder', singleFolder._id])
  }
  drop(event: CdkDragDrop<string[]>){
    console.log("CARD DROP EVENT", event);
  }
}
