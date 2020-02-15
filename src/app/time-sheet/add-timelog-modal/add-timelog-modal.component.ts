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
  defaultTimeIn;
  type: any;
  defaultTimeOut;
  defaultLunchStart;
  defaultLunchEnd;
  currentUser: any;
  disabled: boolean = false;
  currentLogId: any;
  minLunchEnd;
  minLunchStart: any;
  minTimeOut: any;


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
      // if(this.data.end) 

      if (this.data.title == 'Slot-1'){
         this.defaultTimeIn = this.data.start.getHours() + ":" + this.data.start.getMinutes()
        this.defaultLunchStart = this.data.end ? this.data.end.getHours() + ":" + this.data.end.getMinutes() : "--:--"
      }

      // this.defaultTimeIn = this.data.logInTime 
      // this.defaultTimeOut = this.data.logOutTime
      // this.defaultLunchEnd = this.data.lunchEndTime
      // this.defaultLunchStart = this.data.lunchStartTime

      // this.defaultLunchEnd = (this.data && this.data.title == "Slot-2") ? this.defaultLunchEnd = this.date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric' }) : this.data.lunchEndTime
      // this.defaultTimeIn = (this.data && this.data.title == "Slot-1") ? this.date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric' }) : this.data.logInTime
      console.log("this.defaultTimeIn", this.defaultTimeIn);
      this.minLunchEnd = this.data.lunchStartTime
      this.minLunchStart = this.data.logInTime ? this.data.logInTime : this.defaultTimeIn
      this.minTimeOut = this.data.lunchEndTime
      
      if(this.data.time){
        if (this.data.time.in) this.defaultTimeIn = this.data.time.in.hours + ":" + this.data.time.in.minutes
        if (this.data.time.out) this.defaultTimeOut = this.data.time.out.hours + ":" + this.data.time.out.minutes
        if (this.data.time.lunchStart) this.defaultLunchStart = this.data.time.lunchStart.hours + ":" + this.data.time.lunchStart.minutes
        if (this.data.time.lunchEnd) this.defaultLunchEnd = this.data.time.lunchEnd.hours + ":" + this.data.time.lunchEnd.minutes
      }
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
      console.log("getTime", time);
      var temp = time.split(':')
      console.log("temp", temp);
      
      this.hours = temp[0]
      this.minutes = temp[1]
      console.log("hours", this.hours);
      console.log("minutes", this.minutes);
      return ({ hours: this.hours, minutes: this.minutes })
    }
  }

  add() {
    this.timeIn = (this.timeIn == undefined) ? this.getTime(this.defaultTimeIn) : this.timeIn
    this.timeOut = (this.timeOut == undefined) ? this.getTime(this.defaultTimeOut) : this.timeOut
    this.lunchStart = (this.lunchStart == undefined) ? this.getTime(this.defaultLunchStart) : this.lunchStart
    this.lunchEnd = (this.lunchEnd == undefined) ? this.getTime(this.defaultLunchEnd) : this.lunchEnd
    // this.timeIn = (this.timeIn == undefined && this.data.time) ? this.data.time.in : this.timeIn
    // this.timeOut = (this.timeOut == undefined && this.data.time) ? this.data.time.out : this.timeOut
    // this.lunchStart = (this.lunchStart == undefined && this.data.time) ? this.data.time.lunchStart : this.lunchStart
    // this.lunchEnd = (this.lunchEnd == undefined && this.data.time) ? this.data.time.lunchEnd : this.lunchEnd
    
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
      // this._timeSheetService.editTime(data).subscribe(res => {
      //   data['logId'] = this.currentLogId
      //   console.log("res", res);
      //   this.dialogRef.close({ data: data, action: 'edited' })
      // })
    }
    else{
      console.log("this.curremtLogId", this.currentLogId);
      // this._timeSheetService.addTime(data).subscribe(res => {
      //   console.log("res", res);
      //   this.dialogRef.close({ data: res, action: 'added' })
      // }) 
    }
  }

}
