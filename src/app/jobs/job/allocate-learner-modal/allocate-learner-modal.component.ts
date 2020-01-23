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

  constructor(@Inject(MAT_DIALOG_DATA) public DialogData: any, public _filter: FilterService, public _learnerSerice: LearnerService,
    public dialogRef: MatDialogRef<AllocateLearnerModalComponent>, public formBuilder: FormBuilder) { }

  learners;
  learnerCopy;

  allocatedLearners = [];
  //  learnersForm;
  ngOnInit() {
    console.log("This . dialogData", this.DialogData)
    this.learners = this.DialogData.learners;
    this.learnerCopy = this.learners;
    if (this.DialogData.materials > 0) {
      this.btnDisabled = false;
    }
    this.isChecked()
  }
  isChecked() {
    this._learnerSerice.isChecked();
  }



  onSelectChange(event) {
    // event.source.value
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
  }


  filter(filterValue: string) {
    this.learners = this._filter.filter(filterValue, this.learnerCopy, ['name']);
  }

  getLearners() {
    console.log("LEARNERS ARRAY IS", this.allocatedLearners)
    this.dialogRef.close(this.allocatedLearners)
  }

}
