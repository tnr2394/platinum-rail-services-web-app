import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { AddFileModalComponent } from './add-file-modal/add-file-modal.component';
import { EditFileModalComponent } from './edit-file-modal/edit-file-modal.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { FileService } from '../services/file.service';
import { FilterService } from '../services/filter.service';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { NewFileModalComponent } from './new-file-modal/new-file-modal.component'
import { FileUploaderService } from '../services/file-uploader.service';

@Component({
  selector: 'material-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})

export class FilesComponent implements OnInit, OnChanges {
  files = [];
  copyFiles;
  @Input('materialId') materialId: any;
  @Input('folder') folder: any;
  @Input('onCompleteItem') newfile: any;
  @Input('filesFromMaterialTile') filesFromMaterialTile

  @Output() getFileDetails: EventEmitter<any> = new EventEmitter<any>();
  materials: any;
  fileCount: number;
  constructor(public _filter: FilterService, public _newFileUploadService: FileUploaderService, public dialog: MatDialog, public _snackBar: MatSnackBar, public _fileService: FileService) {
  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {

    console.log('New File In Files::::::::::::::::::::::::::::::', this.newfile);

    // console.log("SOMETHING CHANGED!!", this.materialId);
    console.log("SOMETHING CHANGED!!", changes);
    if (this.materialId != undefined) {
      this.files = this.filesFromMaterialTile
      this.copyFiles = this.filesFromMaterialTile
      // this.getFiles();
    }
    if (this.folder != undefined) {
      this.files = this.folder.files;
      this.fileCount = this.files.length
    }
    if (this.newfile) {
      console.log('New File In Files::::::::::::::::::::::::::::::', this.newfile);
      this.files.push(this.newfile)
    }
  }

  ngOnInit() {
    console.log("Initialized Files component by", this.files, { materialId: this.materialId });
    if (this.materialId != undefined) {
      this.files = this.filesFromMaterialTile
      // this.getFiles();
    }
  }


  // MODALS
  addFileModal() {
    let tempQue
    if (this.materialId != undefined) {
      var addedCourse = this.openDialog(NewFileModalComponent, { materialId: this.materialId }).subscribe((fileQueue) => {
        console.log("The queue recieved is", fileQueue);
        if (fileQueue == undefined) return;
        _.forEach(fileQueue, (file) => {
          this.files.push(file);
        })
        console.log("this.files After push", this.files);

        this.openSnackBar("File Uploaded Successfully", "Ok");
        this.updateData(this.files);
        this.fileCount = this.files.length;
      }, err => {
        return this.openSnackBar("Something went wrong", "Ok");
      });
    }
    else if (this.folder != undefined) {
      this.openDialog(NewFileModalComponent, { folderId: this.folder._id }).subscribe(file => {
        console.log("file in folder", file);
        if (file == undefined) return
        _.forEach(file, (data) => {
          this.files.push(data);
        })
        this.fileCount = this.files.length;
      })
    }
    console.log("onCompleteItem from file upload service");


    // this.getFiles();
  }
  updateData(courses: any) {
    // throw new Error("Method not implemented.");
  }
  courses(courses: any) {
    throw new Error("Method not implemented.");
  }
  fileDetails(event) {
    console.log("Event in material-files", event);
    this.getFileDetails.emit(event)
  }

  handleSnackBar(data) {
    this.openSnackBar(data.msg, data.button);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  openDialog(someComponent, data = {}): Observable<any> {
    console.log("OPENDIALOG", "DATA = ", data);
    const dialogRef = this.dialog.open(someComponent, { disableClose: true, width: "1000px", data });
    return dialogRef.afterClosed();
  }

  applyFilter(filterValue: string) {
    console.log('Filtered Value====>>', filterValue, this.copyFiles);
    // this.copyFiles = this.files;
    this.files = this._filter.filter(filterValue, this.copyFiles, ['title', 'type']);
    this.updateData(this.files);
  }


  deletedFile(event) {
    console.log("File Deleted Event : ", event);
    this.openSnackBar("File Deleted Successfully", "Ok");
    this.files.splice(this.files.findIndex(function (i) {
      return i._id === event._id;
    }), 1);
  }

  editCourseModal(index, data) {
    this.openDialog(EditFileModalComponent, data).subscribe((course) => {
      console.log("DIALOG CLOSED", course)
      // Handle Error
      if (course.result == "err") return this.openSnackBar("Course could not be edited", "Ok");

      // EDIT HANDLE
      if (course.action == 'edit') {
        console.log("HANDLING EDIT SUCCESS", course.data);
        data = course.data;
        var Index = this.files.findIndex(function (i) {
          return i._id === data._id;
        })
        this.files[Index] = course.data;
      }
      // DELETE HANDLE
      else if (course.action == 'delete') {
        console.log("Deleted ", course);
        this.files.splice(this.files.findIndex(function (i) {
          return i._id === data._id;
        }), 1);
      }
      this.updateData(this.files);
      this.handleSnackBar({ msg: "Course Edited Successfully", button: "Ok" });
    });
  }

  // API
  getFiles() {
    console.log("Getting files in files component for materialID = ", this.materialId);
    this._fileService.getFilesByMaterial(this.materialId)
      .subscribe(files => {
        console.log("Response from service", files);
        // this.copyFiles = files;
        this.files = files;
        console.log("Files updated with - ", files);
        this.fileCount = this.files.length;
      })
  }
}
