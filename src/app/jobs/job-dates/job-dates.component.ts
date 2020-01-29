import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormGroupDirective, FormArray, NgForm, Validators, } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-job-dates',
  templateUrl: './job-dates.component.html',
  styleUrls: ['./job-dates.component.scss']
})
export class JobDatesComponent implements OnInit {
  public frequencyDays = [
    { id: '0', day: 'Sunday',checked: false },
    { id: '1', day: 'Monday',checked: false },
    { id: '2', day: 'Tuesday',checked: false },
    { id: '3', day: 'Wednesday',checked: false },
    { id: '4', day: 'Thursday',checked: false },
    { id: '5', day: 'Friday',checked: false },
    { id: '6', day: 'Saturday',checked: false }
  ];

  @Input('frequency') frequency: any;
  @Input('duration') duration: any;
  @Input('startingDate') startingDate: any;
  @Input('singleJobDate') singleJobDate: any; // for edit event
  @Output() dateChange : EventEmitter<any> = new EventEmitter<any>();


  dateForm;
  courseDates = [];
  temp = moment(this.startingDate)
  tempArray = [];
  finalCourseDates;
  dayOfTheWeek;
  day;
  event;
  totalDays = [];
  dayExist: Boolean;
  checkEnable : Boolean = true;

  constructor(public formBuilder: FormBuilder) { }

  ngOnInit() {
    console.log("IN JOBDATE", "DAY OF THE WEEK", this.dayOfTheWeek ,this.frequency, "DURATION IS ==",this.duration, "STARTING DATE IS: ",this.startingDate, this.singleJobDate)
    this.temp = moment(this.startingDate)

    this.dateForm = this.formBuilder.group({
      frequency: new FormArray([]),
      singleJobDates : new FormControl()
    })
    this.addCheckboxes();

    if (this.frequency != undefined) {
      this.frequency.forEach((item=>{
        this.frequencyDays.forEach((arrayItem)=>{
          if(arrayItem.day == item){
            arrayItem.checked = true
          }
        })
      }))
      this.singleJobDate.forEach((date)=>{
        let temp = new Date(date)
        this.courseDates.push(temp)
      })
      this.finalCourseDates = this.courseDates.sort((a, b) => b - a).reverse();
    }
  }

  
  addCheckboxes() {
    this.frequencyDays.forEach(() => {
      const control = new FormControl();
      (this.dateForm.controls.frequency as FormArray).push(control);
    });
  }

  enableCheckBoxes(){
    this.checkEnable = false
  }

  // generateDates() {
    public generateDates(event, dayOfTheWeek, day) {
      console.log("Event", event, "DayOf The week", dayOfTheWeek , "Day", day)
      this.dayExist = false
      if (event == true) {
        if (this.startingDate.getDay() == dayOfTheWeek) {
          console.log(this.startingDate.getDay(), '==', dayOfTheWeek)
          this.courseDates.push(this.startingDate)
          console.log("IN second if")
        }
        if (this.totalDays.length < 1){
          console.log("CHECKING LENGTH");
          this.totalDays.push(day)
        } 
        else{
          this.totalDays.forEach((item)=>{
            console.log("COMPARING EACH ITEM");
            console.log("ITEM", item, "== Day", day);
            if(item == day){
              console.log("ITEM", item,"== Day",day);
              this.dayExist = true
              console.log("After comparing DayExists", this.dayExist);
            }
          })
          if (this.dayExist == false) {
            this.totalDays.push(day)
          }
        }
        console.log("this.totaldays", this.totalDays)

        let tempDate: Date = this.temp.toDate();
        console.log("tempDate", tempDate);
        for (var i = 0; i < this.duration; i++) {
          console.log("In for loop");
          let days = (7 - tempDate.getDay() + dayOfTheWeek)
          if (days >= 8) {
            days = (-1) * (7 - days);
          }
          let nextDay = new Date(tempDate.setDate(tempDate.getDate() + days))
          this.courseDates.push(tempDate)
          tempDate = nextDay;
        }
        console.log("for loop ended");
      }

      else {
        console.log("array of Finaldates", this.finalCourseDates)
        console.log("array of course dates", this.courseDates)
        for (var i = 0; i < this.totalDays.length; i++) {
          if (this.totalDays[i] == day) {
            this.totalDays.splice(i, 1)
          }
        }
        let tempDate: Date = this.temp.toDate();
        for (var i = 0; i < this.duration; i++) {
          let days = (7 - tempDate.getDay() + dayOfTheWeek)
          if (days >= 8) {
            days = (-1) * (7 - days);
          }
          let nextDay = new Date(tempDate.setDate(tempDate.getDate() + days))
          for (var j = 0; j < this.courseDates.length; j++) {
            if (this.courseDates[j].getDay() == nextDay.getDay()) {
              this.courseDates.splice(j, 1)
            }
          }
        }
      }
      this.finalCourseDates = this.courseDates.sort((a, b) => b - a).reverse();
      console.log("DATA TO EMIT", this.finalCourseDates.slice(0, this.duration));
      this.dateChange.emit({ singleJobDates: this.finalCourseDates.slice(0,this.duration), totalDays : this.totalDays})
    }

    public EditDates(newDate,arrayOfDays){
      console.log('newdate assigned and all other values cleared')
      
      this.startingDate = newDate;
      this.temp = moment(this.startingDate)
      
      this.courseDates.length = 0;
      this.finalCourseDates = [];
      
      console.log("array of Finaldates", this.finalCourseDates)
      console.log("array of course dates", this.courseDates)
      this.frequencyDays.forEach((arrayItem) => {
          arrayItem.checked = false
      })
      console.log('newdate assigned and all other values cleared')
    }

    public clearCheckBoxes(){
      this.frequencyDays.forEach((arrayItem) => {
        arrayItem.checked = false
      })
      this.courseDates.length = 0;
      this.finalCourseDates = [];
    }
    singleDateChanged(event,j){
      console.log(this.finalCourseDates[j])
      console.log("SINGLE DATE CHANGE EVENT",event.value,j)
      this.finalCourseDates.splice(j, 1, event.value)
      console.log(this.finalCourseDates[j])
      this.dateChange.emit({ singleJobDates: this.finalCourseDates.slice(0, this.duration), totalDays: this.totalDays })
    }
}
