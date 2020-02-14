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
  instructorId;
  date = new Date();
  defaultTimeIn = "";
  type: any;
  defaultTimeOut = "";
  defaultLunchStart = "";
  defaultLunchEnd = "";
  currentUser: any;
  disabled: boolean = false;
  currentLogId: any;


  constructor(private _timeSheetService: TimeSheetService, @Inject(MAT_DIALOG_DATA) public data: any,
   public dialogRef: MatDialogRef<AddTimelogModalComponent>) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if(this.currentUser.userRole == 'instructor') this.instructorId = this.currentUser._id;
    console.log("this.data", this.data)
    if(this.data != null){
      
      this.date = this.data.date ? new Date(this.data.date) : this.data.start;
      if(this.data.logId) this.currentLogId = this.data.logId
      this.disabled = true;

      // this.defaultTimeIn = this.data.logInTime 
      // this.defaultTimeOut = this.data.logOutTime
      // this.defaultLunchEnd = this.data.lunchEndTime
      // this.defaultLunchStart = this.data.lunchStartTime
      this.defaultTimeIn = this.date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric' })
      // if (this.data.timeIn) this.defaultTimeIn = this.data.timeIn.hours + ":" + this.data.timeIn.minutes + " " + this.data.timeIn.type
      if (this.data.timeOut) this.defaultTimeOut = this.data.timeOut.hours + ":" + this.data.timeOut.minutes + " " + this.data.timeOut.type
      if (this.data.lunchStart) this.defaultLunchStart = this.data.lunchStart.hours + ":" + this.data.lunchStart.minutes + " " + this.data.lunchStart.type
      if (this.data.lunchEnd) this.defaultLunchEnd = this.data.lunchEnd.hours + ":" + this.data.lunchEnd.minutes + " " + this.data.lunchEnd.type

    //   // this.defaultTimeIn = this.date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
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
    if(time){
      var temp = time.split(':')
      this.hours = temp[0]
      this.minutes = temp[1]
      // this.type = temp[1].split(' ')[1]
      console.log("hours", this.hours);
      console.log("minutes", this.minutes);
      console.log("type", this.type);
      return ({ hours: this.hours, minutes: this.minutes, type: this.type })
    }
  }

  add() {
    if (this.timeIn == undefined) this.timeIn = this.getTime(this.defaultTimeIn)
    else if (this.timeOut == undefined) this.timeOut = this.getTime(this.defaultTimeOut)
    else if (this.lunchStart == undefined) this.lunchStart = this.getTime(this.defaultLunchStart)
    else if (this.lunchEnd == undefined) this.lunchEnd = this.getTime(this.defaultLunchEnd)
    let timeLog = {
      date: this.date,
      in: this.timeIn,
      lunchStart: this.lunchStart,
      lunchEnd: this.lunchEnd,
      out: this.timeOut,
    }
    let data = {
      timeLog: timeLog,
      instructorId: this.instructorId,
    }
    console.log("Data to send", data);
    // this.dialogRef.close(data)
    
    if (this.currentLogId){
      console.log("this.curremtLogId", this.currentLogId);
      this._timeSheetService.editTime(data).subscribe(res => {
        data['logId'] = this.currentLogId
        console.log("res", res);
        this.dialogRef.close({ data: data, action: 'edited' })
      })
    }
    else{
      console.log("this.curremtLogId", this.currentLogId);
      this._timeSheetService.addTime(data).subscribe(res => {
        console.log("res", res);
        this.dialogRef.close({ data: res, action: 'added' })
      }) 
    }
  }

}
