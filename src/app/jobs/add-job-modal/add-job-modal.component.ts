import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
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
  duration = 10;
  finalCourseDates = [];
  instructor: FormArray;

  frequencyDays = [
    { day: 'Sunday',disabled: true },
    { day: 'Monday',disabled: true},
    { day: 'Tuesday',disabled: true },
    { day: 'Wednesday',disabled: true },
    { day: 'Thursday',disabled: true },
    { day: 'Friday',disabled: true },
    { day: 'Saturday',disabled: true }
  ];

  constructor(public formBuilder: FormBuilder, public dialogRef: MatDialogRef<AddJobModalComponent>) {}
  
  createInstructor(): FormGroup{
    return this.formBuilder.group({
      singleInstructor : new FormControl('')
    })
  }

  addInstructor(){
    this.instructor = this.addJobForm.get('instructor') as FormArray;
    this.instructor.push(this.createInstructor())
  }
  removeInstructor() {
    this.instructor.removeAt(this.instructor.length - 1);
  }

  private addCheckboxes() {
    this.frequencyDays.forEach(() => {
      const control = new FormControl();
      (this.addJobForm.controls.frequency as FormArray).push(control);
    });
  }

  searchDays($event){
    this.frequencyDays.forEach(item => item.disabled = false);
    this.startingDate = $event.value;
    this.temp = moment($event.value);
  }

  onCheckChange(event, dayOfTheWeek){
    console.log(event, dayOfTheWeek)
    if(event == true){
      this.totalDays.push(dayOfTheWeek)
      console.log(this.totalDays)
      let tempDate: Date = this.temp.toDate();
      for (var i = 0; i < this.duration; i++) {
        let days = (7 - tempDate.getDay() + dayOfTheWeek)
          if (days >= 8) {
            days = (-1)*(7 - days);
          }
        let nextDay = new Date(tempDate.setDate(tempDate.getDate() + days))
        this.courseDates.push(tempDate)
        tempDate = nextDay;
        }
    }

    else {
      for(var i = 0; i < this.totalDays.length; i++){
        if(this.totalDays[i] == dayOfTheWeek){
              this.totalDays.splice(i,1)
            }
      }
      console.log("Total days", this.totalDays)
      let tempDate: Date = this.temp.toDate();
      for (var i = 0; i < this.duration; i++) {
        let days = (7 - tempDate.getDay() + dayOfTheWeek)
        if (days >= 8) {
          days = (-1) * (7 - days);
        }
        let nextDay = new Date(tempDate.setDate(tempDate.getDate() + days))
        for(var j = 0; j < this.courseDates.length; j++){
             if(this.courseDates[j].getDay() == nextDay.getDay()){
              this.courseDates.splice(j,1)
            }
          }
        }
    }
  this.finalCourseDates = this.courseDates.sort((a,b)=> b - a).reverse();
  }

  datesForJobChange($event,index){
    this.finalCourseDates[index] = this.addJobForm.controls.singleJobDate.value
  }

  addJob(){
    this.addJobForm.controls['singleJobDate'].setValue(this.finalCourseDates);
    this.dialogRef.close(this.addJobForm.value )
  }
  ngOnInit() {
    this.addJobForm = this.formBuilder.group({
      title: new FormControl(''),
      jobColor: new FormControl(''),
      client: new FormControl(''),
      instructor: new FormArray([this.createInstructor()]),
      location: new FormControl(''),
      course: new FormControl(''),
      date: new FormControl(),
      frequency: new FormArray([]),
      singleJobDate: new FormControl()
    });
    this.addCheckboxes();
    this.finalCourseDates = [];
  }
}
