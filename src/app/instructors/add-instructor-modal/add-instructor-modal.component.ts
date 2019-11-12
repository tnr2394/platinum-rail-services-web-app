import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { InstructorService } from "../../services/instructor.service";
export interface Instructor {
  _id: string;
  name: string;
  dateOfJoining: Date;
  email: string;
  password: string;
  qualifications:[]
};

@Component({
  selector: 'app-add-instructor-modal',
  templateUrl: './add-instructor-modal.component.html',
  styleUrls: ['./add-instructor-modal.component.scss']
})
export class AddInstructorModalComponent implements OnInit {
  loading: Boolean = false;
  ngOnInit() {
  }
  constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any, public _instructorService: InstructorService) {
    // NO DEFINITION
}

doSubmit(){
  console.log("Submit ",this.data);
  // Do Submit
  this.loading = true;    
  this._instructorService.addInstructor(this.data).subscribe(data=>{
    this.data = data;
    this.loading = false;
    this.dialogRef.close(data);

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
