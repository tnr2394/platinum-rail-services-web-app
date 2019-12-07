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
  passwordMismatch: boolean;
  ngOnInit() {
  }
  constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any, public _instructorService: InstructorService) {
    // NO DEFINITION
}
validate(data){
  console.log("Validating ",data);
  if(!data.name) return false;
  if(!data.email) return false;
  if(!data.password) return false;
  if(!data.confirmPassword) return false;
  if(data.password !== data.confirmPassword){ 
    this.passwordMismatch = true;
    return false;
  }
  this.passwordMismatch = false;
  return true;
}
doSubmit(){
  console.log("Submit ",this.data);
  console.log("Validating = ",this.validate(this.data));
  if(!this.validate(this.data)){
    console.log("RETURNING");
    return;
  }

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
