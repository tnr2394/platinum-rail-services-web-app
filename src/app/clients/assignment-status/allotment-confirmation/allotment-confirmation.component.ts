import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-allotment-confirmation',
  templateUrl: './allotment-confirmation.component.html',
  styleUrls: ['./allotment-confirmation.component.scss']
})
export class AllotmentConfirmationComponent implements OnInit {
  dueDate;
  disabled = true

  constructor(public dialogRef: MatDialogRef<AllotmentConfirmationComponent>) { }

  ngOnInit() {
  }
  dateSelected($event){
    console.log("event", event, "dueDate", this.dueDate);
    this.disabled = false
  }
  confirm(msg){
    if (msg == 'allocate'){
      this.dialogRef.close(this.dueDate)
    }
    else this.dialogRef.close()
  }
}
