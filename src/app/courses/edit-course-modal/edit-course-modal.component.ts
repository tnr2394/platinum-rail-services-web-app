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
  ngOnInit() {
  }
  constructor(public dialogRef: MatDialogRef<Course>, @Inject(MAT_DIALOG_DATA) public data: any, public _courseService: CourseService) {
      // NO DEFINITION
  }

  doSubmit(){
    console.log("Submit ",this.data);
    // Do Submit
    // this._course.editCourse()
    this.loading = true;    
    this._courseService.editCourse(this.data).subscribe(courses=>{
      this.data = courses;
      this.loading = true;
      this.dialogRef.close(courses);
    },err=>{
      alert("Error editing course.")
      this.loading = true;
      this.dialogRef.close();
    });
  }

  delete(){
    console.warn("DELETING ",this.data._id);
    this.loading = true;    
    this._courseService.deleteCourse(this.data).subscribe(courses=>{
      this.data = courses;
      this.loading = true;
      this.dialogRef.close(courses);
    },err=>{
      alert("Error deleting course.")
      this.loading = true;
      this.dialogRef.close();
    });

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
