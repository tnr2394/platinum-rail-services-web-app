import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Course } from 'src/app/interfaces/course';
import {CourseService} from '../../services/course.service'

@Component({
  selector: 'app-edit-course-modal',
  templateUrl: './edit-course-modal.component.html',
  styleUrls: ['./edit-course-modal.component.scss']
})
export class EditCourseModalComponent implements OnInit {
  loading: Boolean = false;
  courseData;
  ngOnInit() {

    console.log("DATA = ",this.data);
    this.courseData = JSON.parse(JSON.stringify(this.data));
  }
  constructor(public dialogRef: MatDialogRef<Course>, @Inject(MAT_DIALOG_DATA) public data: any, public _courseService: CourseService) {
      // NO DEFINITION
  }

  doSubmit(){
    console.log("Submit ",this.data);
    // Do Submit
    this.loading = true;    
    this._courseService.editCourse(this.courseData).subscribe(courses=>{
      this.data = this.courseData;
      this.loading = false;
      this.closoeDialog({
        action: 'edit',
        result: 'success',
        data: this.courseData
      });
    },err=>{
      alert("Error editing course.")
      this.loading = false;
      this.closoeDialog({
        action: 'edit',
        result: 'err',
        data: err
      });
    });
  }

  delete(){
    console.warn("DELETING ",this.data._id);
    this.loading = true;    
    this._courseService.deleteCourse(this.courseData._id).subscribe(courses=>{
      this.data = courses;
      this.loading = false;
      this.closoeDialog({
        action: 'delete',
        result: 'success',
        data: this.courseData
      });
    },err=>{
      alert("Error deleting course.")
      this.loading = false;
      this.closoeDialog({
        action: 'delete',
        result: 'err',
        data: err
      });
    });

  }



  closoeDialog(result){
    this.dialogRef.close(result);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
