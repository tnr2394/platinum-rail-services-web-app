import { Component, OnInit, Inject } from '@angular/core';
import { TimeSheetService } from '../../services/time-sheet.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-timelog-modal',
  templateUrl: './add-timelog-modal.component.html',
  styleUrls: ['./add-timelog-modal.component.scss']
})
export class AddTimelogModalComponent implements OnInit {
  lunchEnd;
  timeIn;
  lunchStart;
  timeOut;
  hours;
  minutes;
  instructorId = "5e3bca2d84e1d3313c6b8ad7";
  date = new Date();
  defaultTimeIn = "00:00 AM";
  type: any;


  constructor(private _timeSheetService: TimeSheetService, @Inject(MAT_DIALOG_DATA) public data: any,
   public dialogRef: MatDialogRef<AddTimelogModalComponent>) { }

  ngOnInit() {
    console.log("this.data", this.data)
    if(this.data != null){
      this.date = this.data.start;
      this.defaultTimeIn = this.data.timeIn.hours + ":" + this.data.timeIn.minutes + " " + this.data.timeIn.type
      // this.defaultTimeIn = this.date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    }
    else this.date = new Date()
    
  }

  dateSelected(event) {
    console.log("dateSelected event", event.value);
    this.date = event.value;
  }

  timeChanged(event) {
    console.log("event in time-sheet", event);
    if (event.logFor == 'timeIn') this.timeIn = this.getTime(event.time);
    else if (event.logFor == 'timeOut') this.timeOut = this.getTime(event.time)
    else if (event.logFor == 'lunchStart') this.lunchStart = this.getTime(event.time)
    else if (event.logFor == 'lunchEnd') this.lunchEnd = this.getTime(event.time)
  }
  getTime(time) {
    var temp = time.split(':')
    this.hours = temp[0]
    this.minutes = temp[1].split(' ')[0]
    this.type = temp[1].split(' ')[1]
    console.log("hours", this.hours);
    console.log("minutes", this.minutes);
    return ({ hours: this.hours, minutes: this.minutes, type: this.type })
  }

  add() {
    if (this.timeIn == undefined) this.timeIn = this.getTime(this.defaultTimeIn)
    let timeLog = {
      date: this.date,
      in: this.timeIn,
      lunchStart: this.lunchStart,
      lunchEnd: this.lunchEnd,
      out: this.timeOut,
    }
    let data = {
      timeLog: timeLog,
      instructorId: this.instructorId
    }
    console.log("Data to send", data);
    this.dialogRef.close(data)
    
    if(this.data == null){
      this._timeSheetService.addTime(data).subscribe(res => {
        console.log("res", res);
      })
    }
    else{
      this._timeSheetService.editTime(data).subscribe(res => {
        console.log("res", res);
      })
    }
  }

}
