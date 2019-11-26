import { Component, OnInit, Input } from '@angular/core';
import { AddFileModalComponent } from './add-file-modal/add-file-modal.component';
import { EditFileModalComponent } from './edit-file-modal/edit-file-modal.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';

@Component({
  selector: 'files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {
  @Input('files') files: any;
  materials: any;
  constructor(public dialog: MatDialog, public _snackBar: MatSnackBar,) { }

  ngOnInit() {
    console.log("Initialized Files component by",this.files);
  }

  
  // MODALS
  addFileModal(){
    var addedCourse = this.openDialog(AddFileModalComponent ).subscribe((courses)=>{
      if(courses == undefined) return;
      console.log("Course added in controller = ",courses);
      this.files.push(courses);
      this.openSnackBar("Course Added Successfully","Ok");
      this.updateData(this.files); 
    },err=>{
      return this.openSnackBar("Course could not be Added","Ok");
    });
  }
  updateData(courses: any) {
    throw new Error("Method not implemented.");
  }
  courses(courses: any) {
    throw new Error("Method not implemented.");
  }

  handleSnackBar(data){
    this.openSnackBar(data.msg,data.button);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  
  openDialog(someComponent,data = {}): Observable<any> {
    console.log("OPENDIALOG","DATA = ",data);
    const dialogRef = this.dialog.open(someComponent, {width:"1000px",data});
    return dialogRef.afterClosed();
  }
  
  
  deletedFile(event){
    console.log("File Deleted Event : ",event);
    this.files.splice(this.files.findIndex(function(i){
      return i._id === event._id;
    }), 1);

  }
  
  editCourseModal(index, data){
    this.openDialog(EditFileModalComponent,data).subscribe((course)=>{
      console.log("DIALOG CLOSED",course)
      // Handle Error
      if(course.result == "err") return this.openSnackBar("Course could not be edited","Ok");
      
      // EDIT HANDLE
      if(course.action == 'edit'){
        console.log("HANDLING EDIT SUCCESS",course.data);
        data = course.data;
        var Index = this.files.findIndex(function(i){
          return i._id === data._id;
        })
        this.files[Index] = course.data;
      }
      // DELETE HANDLE
      else if(course.action == 'delete'){
        console.log("Deleted ",course);
        this.files.splice(this.files.findIndex(function(i){
          return i._id === data._id;
        }), 1);
      }
      this.updateData(this.files);
      this.handleSnackBar({msg:"Course Edited Successfully",button:"Ok"});
    });
  }
  
}
