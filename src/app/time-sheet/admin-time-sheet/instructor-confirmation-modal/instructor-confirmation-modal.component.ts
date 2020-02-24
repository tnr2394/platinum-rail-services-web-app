import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AddTimelogModalComponent } from '../../add-timelog-modal/add-timelog-modal.component';

@Component({
  selector: 'app-instructor-confirmation-modal',
  templateUrl: './instructor-confirmation-modal.component.html',
  styleUrls: ['./instructor-confirmation-modal.component.scss']
})
export class InstructorConfirmationModalComponent implements OnInit {
  instructorChosen;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddTimelogModalComponent>) { }

  ngOnInit() {
  }
  search(){
    console.log("instructorChosen", this.instructorChosen);
    this.dialogRef.close(this.instructorChosen)
  }

}
