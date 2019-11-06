import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Course } from 'src/app/interfaces/course';

@Component({
  selector: 'app-edit-course-modal',
  templateUrl: './edit-course-modal.component.html',
  styleUrls: ['./edit-course-modal.component.scss']
})
export class EditCourseModalComponent implements OnInit {
  ngOnInit() {
  }
  constructor(public dialogRef: MatDialogRef<Course>, @Inject(MAT_DIALOG_DATA) public data: any) {
      // NO DEFINITION
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
