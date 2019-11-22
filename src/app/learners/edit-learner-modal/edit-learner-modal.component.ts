import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Course } from 'src/app/interfaces/course';
import {LearnerService} from '../../services/learner.service'

@Component({
  selector: 'app-edit-learner-modal',
  templateUrl: './edit-learner-modal.component.html',
  styleUrls: ['./edit-learner-modal.component.scss']
})
export class EditLearnerModalComponent implements OnInit {
  loading: Boolean = false;
  learnerData;
  passwordMismatch: boolean;
  ngOnInit() {

    console.log("DATA = ",this.data);
    this.learnerData = JSON.parse(JSON.stringify(this.data));
    this.data.confirmPassword = this.data.password;
  }
  constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any, public _learnerService: LearnerService) {
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
    this._learnerService.editLearner(this.data).subscribe(learner=>{
      this.learnerData = learner;
      console.log("learnerDATA = ",learner);
      this.loading = false;
      this.closoeDialog({
        action: 'edit',
        result: 'success',
        data: this.learnerData
      });
    },err=>{
      alert("Error editing Client.")
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
    this._learnerService.deleteLearner(this.learnerData._id).subscribe(learners=>{
      // this.data = learners;
      this.loading = false;
      this.closoeDialog({
        action: 'delete',
        result: 'success',
        data: this.learnerData
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
