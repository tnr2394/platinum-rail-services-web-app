import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material'
import { Observable } from 'rxjs';
import { CreateFolderModalComponent } from './create-folder-modal/create-folder-modal.component';
import { FolderService } from '../services/folder.service';
import { ContextMenuComponent } from "ngx-contextmenu";
import { ShareFileModalComponent } from './share-file-modal/share-file-modal.component';
import { ok } from 'assert';
import { Router } from '@angular/router';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent implements OnInit {

  allFolders = [];
  bgColors;
  lastColor;
  preventSingleClick = false;
  timer: any;
  delay: Number;
  display = false;
  currentUser;

  @ViewChild(ContextMenuComponent, { static: false }) public basicMenu: ContextMenuComponent;
  details: any;

  constructor(public _folderService: FolderService, public dialog: MatDialog, public _snackBar: MatSnackBar, public router: Router) {
    this.bgColors = ["bg-info", "bg-success", "bg-warning", "bg-primary", "bg-danger"];
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.currentUser);
    if (this.currentUser.userRole == 'admin') {
      this.getFolders();
    } else {
      this.getSharedFolders();
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
    this.openDialog(CreateFolderModalComponent).subscribe(folder => {
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
    });
  }

  getSharedFolders() {
    var that = this;
    this._folderService.getSharedFolders().subscribe((folders) => {
      console.log('Folders', folders);
      this.allFolders = folders;
    });
  }

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
}
