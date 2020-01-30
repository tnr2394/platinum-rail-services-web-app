import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { AddFileModalComponent } from './add-file-modal/add-file-modal.component';
import { EditFileModalComponent } from './edit-file-modal/edit-file-modal.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { FileService } from '../services/file.service';
import { FilterService } from '../services/filter.service';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'material-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit, OnChanges {
  files = [];
  copyFiles;
  @Input('materialId') materialId: any;

  materials: any;
  fileCount: number;
  constructor(public _filter: FilterService, public dialog: MatDialog, public _snackBar: MatSnackBar, public _fileService: FileService) {
  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log("SOMETHING CHANGED!!", this.materialId);
    this.getFiles();
  }

  ngOnInit() {
    console.log("Initialized Files component by", this.files, { materialId: this.materialId });
    this.getFiles();
  }


  // MODALS
  addFileModal() {
    var addedCourse = this.openDialog(AddFileModalComponent, { materialId: this.materialId }).subscribe((courses) => {
      if (courses == undefined) return;
      console.log("Course added in controller = ", courses);

      _.forEach(courses, (data) => {
        this.files.push(data);
      })

      this.openSnackBar("File Uploaded Successfully", "Ok");
      this.updateData(this.files);
    }, err => {
      return this.openSnackBar("Something went wrong", "Ok");
    });
  }
  updateData(courses: any) {
    // throw new Error("Method not implemented.");
  }
  courses(courses: any) {
    throw new Error("Method not implemented.");
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
    const dialogRef = this.dialog.open(someComponent, { width: "1000px", data });
    return dialogRef.afterClosed();
  }

  applyFilter(filterValue: string) {
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
        this.copyFiles = files;
        this.files = files;
        console.log("Files updated with - ", files);
        this.fileCount = this.files.length;
      })
  }
}
