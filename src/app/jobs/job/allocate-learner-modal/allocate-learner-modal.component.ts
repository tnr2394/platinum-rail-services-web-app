import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, throwToolbarMixedModesError } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, FormGroupDirective, FormArray, NgForm, Validators, } from '@angular/forms';
import { LearnerService } from '../../../services/learner.service';
import { FilterService } from '../../../services/filter.service';


@Component({
  selector: 'app-allocate-learner-modal',
  templateUrl: './allocate-learner-modal.component.html',
  styleUrls: ['./allocate-learner-modal.component.scss']
})
export class AllocateLearnerModalComponent implements OnInit {
  loading: boolean;
  searchText;
  btnDisabled: Boolean = true;
  checked: boolean;
  duedate: any;
  checkEnable: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public DialogData: any, public _filter: FilterService, public _learnerSerice: LearnerService,
    public dialogRef: MatDialogRef<AllocateLearnerModalComponent>, public formBuilder: FormBuilder) { }

  learners;
  learnerCopy;

  allocatedLearners = [];
  //  learnersForm;
  ngOnInit() {
    this.checkEnable = true;
    console.log("This . dialogData", this.DialogData)
    this.learners = this.DialogData.learners;
    this.learners.forEach(learner => {
      Object.assign(learner, { checked: false })
    })
    this.learnerCopy = this.learners;
    if (this.DialogData.materials > 0) {
      this.btnDisabled = false;
    }
    this.isChecked()
  }
  isChecked() {
    this._learnerSerice.isChecked();
  }

  selectAll(){
    this.checked = true
    this.learners.forEach(learner =>{
      this.allocatedLearners.push(learner);
    })
  }

  checkSelection(event){
    if(event.checked == true){
      this.checked = true;
      this.learners.forEach(learner => {
        learner.checked = true;
        this.allocatedLearners.push(learner);
      })
    }
    else{
      this.checked = false;
      this.learners.forEach(learner => {
        learner.checked = false;
        this.allocatedLearners = [];
      })
    }
  }

  onSelectChange(event, i) {
    console.log("EVENT CHANGE", event)

    if (event.checked == true) {
      this.allocatedLearners.push(event.source.value)
    }
    if (event.checked == false) {
      this.allocatedLearners.forEach((learner) => {
        if (learner._id == event.source.value._id) {
          this.allocatedLearners.splice(learner, 1)
        }
      })
    }
    console.log("allocated learners", this.allocatedLearners);
  }
  dueDate(event){
    this.checkEnable = false;
    console.log("Due date", event);
    this.duedate = event.value;
    this.learners.forEach(learner => {
      learner.duedate = this.duedate;
      // Object.assign(learner, {dueDate: this.duedate})
    });
  }
  singleDateChange(event, learner){
    learner.duedate = event.value;
  }

  filter(filterValue: string) {
    this.learners = this._filter.filter(filterValue, this.learnerCopy, ['name']);
  }

  getLearners() {
    console.log("LEARNERS ARRAY IS**********", this.allocatedLearners)
    this.dialogRef.close(this.allocatedLearners)
  }

}
