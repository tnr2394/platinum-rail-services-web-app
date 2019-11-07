import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CourseService } from "../../services/course.service";
export interface Course {
  _id: string;
  title: string;
  duration: number;
};

@Component({
  selector: 'app-add-course-modal',
  templateUrl: './add-course-modal.component.html',
  styleUrls: ['./add-course-modal.component.scss']
})
export class AddCourseModalComponent implements OnInit {
    loading: Boolean = false;
    ngOnInit() {
    }
    constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any, public _courseService: CourseService) {
      // NO DEFINITION
  }

  doSubmit(){
    console.log("Submit ",this.data);
    // Do Submit
    // this._course.editCourse()
    console.log("ADDING COURSE",this.data);
    this.loading = true;    
    this._courseService.addCourse(this.data).subscribe(data=>{
      this.data = data.courses;
      console.log("ADDED res",data.course);
      this.loading = false;
      this.dialogRef.close(data.course);

    },err=>{
      alert("Error editing course.")
      this.loading = false;
      this.dialogRef.close();

    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
