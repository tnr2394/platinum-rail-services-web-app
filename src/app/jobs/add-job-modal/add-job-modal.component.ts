import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-add-job-modal',
  templateUrl: './add-job-modal.component.html',
  styleUrls: ['./add-job-modal.component.scss']
})
export class AddJobModalComponent implements OnInit {

  addJobForm;
  courseDates = [];
  startingDate;
  temp;
  jobDates: FormArray;
  nextDay;
  totalDays = [];
  duration = 5;
  soretdArray = [];

  frequencyDays = [
    { day: 'Sunday' },
    { day: 'Monday'},
    { day: 'Tuesday' },
    { day: 'Wednesday' },
    { day: 'Thursday' },
    { day: 'Friday' },
    { day: 'Saturday' }
  ];

  constructor(public formBuilder: FormBuilder) {
    this.addJobForm = this.formBuilder.group({
      client : new FormControl(''),
      instructor: new FormControl(''),
      location: new FormControl(''),
      course: new FormControl(''),
      date: new FormControl(''),
      frequency: new FormArray([]),
      jobDates: new FormArray([this.jobArray()]),
    });
    this.addCheckboxes();
   }
   jobArray(): FormGroup{
     return this.formBuilder.group({
       singleJobDate:['']
     });
   }

  private addCheckboxes() {
    this.frequencyDays.forEach(() => {
      const control = new FormControl();
      (this.addJobForm.controls.frequency as FormArray).push(control);
    });
  }

  searchDays($event){
    this.startingDate = $event.value;
    this.temp = moment($event.value);
  }

  onCheckChange(event, dayOfTheWeek){
    if(event == true){

      this.totalDays.push(dayOfTheWeek)
      console.log(this.totalDays)
      let tempDate: Date = this.temp.toDate();
      for (var i = 0; i < this.duration; i++) {
        let days = (7 - tempDate.getDay() + dayOfTheWeek)
        let nextDay = new Date(tempDate.setDate(tempDate.getDate() + days))
        this.courseDates.push(tempDate)
        tempDate = nextDay;
        }
    }

    else {
      for(var i = 0; i < this.totalDays.length; i++){
        if(this.totalDays[i] == dayOfTheWeek)
            this.totalDays.splice(i,1)
      }
      console.log("Total days", this.totalDays)
      let tempDate: Date = this.temp.toDate();
      for (var i = 0; i < 10; i++) {
        let days = (7 - tempDate.getDay() + dayOfTheWeek)
        let nextDay = new Date(tempDate.setDate(tempDate.getDate() + days))
        tempDate = nextDay;
        for(var j = 0; j < this.courseDates.length; j++){
           if(this.courseDates[j].getDay() == tempDate.getDay()){
            this.courseDates.splice(j,1)
          }
      }
      console.log("THE ARRAY IS", this.courseDates)
    }
  }

  this.soretdArray = this.courseDates.sort((a,b)=> b - a).reverse();
  console.log("SORTED ARRAY IS", this.soretdArray)
  }

  datesForJobChange($event,index){
    console.log('Index of courdeDates is', index)
    let jobdatevalues = this.addJobForm.get('jobDates') as FormArray;
    console.log(jobdatevalues.value)
  }
  ngOnInit() {
  }

}
