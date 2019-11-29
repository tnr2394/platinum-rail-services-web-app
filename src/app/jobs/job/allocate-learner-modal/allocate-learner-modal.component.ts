import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, throwToolbarMixedModesError } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, FormGroupDirective, FormArray, NgForm, Validators, } from '@angular/forms';

@Component({
  selector: 'app-allocate-learner-modal',
  templateUrl: './allocate-learner-modal.component.html',
  styleUrls: ['./allocate-learner-modal.component.scss']
})
export class AllocateLearnerModalComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public DialogData: any,
   public dialogRef: MatDialogRef<AllocateLearnerModalComponent>, public formBuilder: FormBuilder ) { }

   learners;

   allocatedLearners = [];
  //  learnersForm;
  ngOnInit() {
    console.log("This . dialogData", this.DialogData)
    this.learners = this.DialogData;

    // this.learnersForm = this.formBuilder.group({
    //   learners: new FormControl()
    // })
  }

  onSelectChange(event){
    // event.source.value
    console.log("EVENT CHANGE", event)

    if(event.checked == true){
      this.allocatedLearners.push(event.source.value)
    }
    if(event.checked == false){
      this.allocatedLearners.forEach((learner)=>{
        if(learner._id == event.source.value._id){
          this.allocatedLearners.splice(learner,1)
        }
      })
    }
  }

  getLearners(){
    console.log("LEARNERS ARRAY IS", this.allocatedLearners)
    this.dialogRef.close(this.allocatedLearners)
  }

}
