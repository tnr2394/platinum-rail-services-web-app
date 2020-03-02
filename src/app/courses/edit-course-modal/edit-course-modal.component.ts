import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { Course } from 'src/app/interfaces/course';
import { CourseService } from '../../services/course.service';
import { DeleteConfirmModalComponent } from '../../commons/delete-confirm-modal/delete-confirm-modal.component';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-edit-course-modal',
  templateUrl: './edit-course-modal.component.html',
  styleUrls: ['./edit-course-modal.component.scss']
})
export class EditCourseModalComponent implements OnInit {
  loading: Boolean = false;
  courseData;
  ngOnInit() {

    console.log("DATA = ", this.data);
    this.courseData = JSON.parse(JSON.stringify(this.data));
  }
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<Course>, @Inject(MAT_DIALOG_DATA) public data: any, public _courseService: CourseService) {
    // NO DEFINITION
  }

  doSubmit() {
    console.log("Submit ", this.data);
    // Do Submit
    this.loading = true;
    this._courseService.editCourse(this.courseData).subscribe(courses => {
      this.data = this.courseData;
      this.loading = false;
      this.closoeDialog({
        action: 'edit',
        result: 'success',
        data: this.courseData
      });
    }, err => {
      alert("Error editing course.")
      this.loading = false;
      this.closoeDialog({
        action: 'edit',
        result: 'err',
        data: err
      });
    });
  }

  delete() {
    console.warn("DELETING ", this.data._id);
    this.openDialog(DeleteConfirmModalComponent).subscribe(confirm => {
      if (confirm == '') return
      else if (confirm == 'yes') {
        this._courseService.deleteCourse(this.courseData._id).subscribe(courses => {
          this.data = courses;
          this.loading = false;
          this.closoeDialog({
            action: 'delete',
            result: 'success',
            data: this.courseData
          });
        }, err => {
          alert("Error deleting course.")
          this.loading = false;
          this.closoeDialog({
            action: 'delete',
            result: 'err',
            data: err
          });
        });
      }
    })
  }


  openDialog(someComponent, data = {}): Observable<any> {
    console.log("OPENDIALOG", "DATA = ", data);
    const dialogRef = this.dialog.open(someComponent, { data, width: '500px', height: '600px' });
    return dialogRef.afterClosed();
  }
  
  closoeDialog(result) {
    this.dialogRef.close(result);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
