import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
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
  
    ngOnInit() {
    }
    constructor(public dialogRef: MatDialogRef<Course>, @Inject(MAT_DIALOG_DATA) public data: Course) {
        // NO DEFINITION
    }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
  }
