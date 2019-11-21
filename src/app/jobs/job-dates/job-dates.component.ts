import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormGroupDirective, FormArray, NgForm, Validators, } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-job-dates',
  templateUrl: './job-dates.component.html',
  styleUrls: ['./job-dates.component.scss']
})
export class JobDatesComponent implements OnInit {
  frequencyDays = [
    { id: '0', day: 'Sunday' },
    { id: '1', day: 'Monday' },
    { id: '2', day: 'Tuesday' },
    { id: '3', day: 'Wednesday' },
    { id: '4', day: 'Thursday' },
    { id: '5', day: 'Friday' },
    { id: '6', day: 'Saturday' }
  ];

  @Input('frequency') frequency: any;
  @Input('duration') duration: any;
  @Input('startingDate') startingDate: any;
  @Output() onDaySelection : EventEmitter<any> = new EventEmitter<any>();


  dateForm;
  courseDates = [];
  temp = moment(this.startingDate)
  finalCourseDates;
  dayOfTheWeek;
  day;
  event;
  totalDays = [];

  constructor(public formBuilder: FormBuilder) { }

  ngOnInit() {
    console.log("IN JOBDATE", this.frequency, this.duration, this.startingDate)
    // this.dayOfTheWeek = this.frequency.dayOfTheWeek
    // this.day = this.frequency.day
    // this.event = this.frequency.checkEvent
    this.dateForm = this.formBuilder.group({
      frequency: new FormArray([]),
      
      // frequency : new FormArray([]),
      // duration : new FormControl(),
      // startingDate : new FormControl(),
      singleJobDates : new FormControl()
    })
    this.addCheckboxes();

    // this.generateDates()
  }

  addCheckboxes() {
    this.frequencyDays.forEach(() => {
      const control = new FormControl();
      (this.dateForm.controls.frequency as FormArray).push(control);
    });
  }

  // generateDates() {
    generateDates(event, dayOfTheWeek, day) {
      if (event == true) {
        if (this.startingDate.getDay() == dayOfTheWeek) {
          console.log(this.startingDate.getDay(), '==', dayOfTheWeek)
          this.courseDates.push(this.startingDate)
        }
        this.totalDays.push(day)

        let tempDate: Date = this.temp.toDate();
        for (var i = 0; i < this.duration; i++) {
          let days = (7 - tempDate.getDay() + dayOfTheWeek)
          if (days >= 8) {
            days = (-1) * (7 - days);
          }
          let nextDay = new Date(tempDate.setDate(tempDate.getDate() + days))
          this.courseDates.push(tempDate)
          tempDate = nextDay;
        }
      }

      else {
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
      this.onDaySelection.emit({ singleJobDates: this.finalCourseDates, totalDays : this.totalDays})
    }
}
