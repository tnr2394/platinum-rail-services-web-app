import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-add-job-modal',
  templateUrl: './add-job-modal.component.html',
  styleUrls: ['./add-job-modal.component.scss']
})
export class AddJobModalComponent implements OnInit {

  addJobForm;
  courseDates = [];
  startingDate;
  tempDates = [];
  temp;

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
      frequency: new FormArray([])
    });
    this.addCheckboxes();
   }

  private addCheckboxes() {
    this.frequencyDays.forEach(() => {
      const control = new FormControl();
      (this.addJobForm.controls.frequency as FormArray).push(control);
    });
  }

  searchDays($event){
    this.startingDate = $event.value;
    console.log(this.startingDate)
  }

  onCheckChange(event, dayOfTheWeek){

    console.log(event, dayOfTheWeek)
    console.log("DATE IS", this.startingDate.getDay())

    if(event == true){
      let tempDate: Date = this.startingDate;
      console.log('if event is true the startingDate is', this.startingDate)
      for (var i = 0; i < 10; i++) {
        let days = (7 - tempDate.getDay() + dayOfTheWeek)
        let nextDay = new Date(tempDate.setDate(tempDate.getDate() + days))
        tempDate = nextDay;
        this.courseDates.push(tempDate);
      }
    }

    else {
      console.log('EVENT IS FALSE')
      console.log(event, dayOfTheWeek)
      let tempDate: Date = this.startingDate;
      console.log('if event is FALSE the tempDate is', this.startingDate)
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
  }
  ngOnInit() {
  }

}
