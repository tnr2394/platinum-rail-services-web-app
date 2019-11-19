import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormGroupDirective, FormArray, NgForm, Validators, } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ErrorStateMatcher } from '@angular/material/core';
import * as moment from 'moment';

import { ClientService } from '../../services/client.service';
import { CourseService } from '../../services/course.service';
import { InstructorService } from '../../services/instructor.service';
import { JobService } from '../../services/job.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-add-job-modal',
  templateUrl: './add-job-modal.component.html',
  styleUrls: ['./add-job-modal.component.scss'],
})
export class AddJobModalComponent implements OnInit {

  clients;
  courses;
  instructors;
  jobs;
  addJobForm;
  courseDates = [];
  startingDate;
  temp;
  jobDates: FormArray;
  totalDays = [];
  duration;
  finalCourseDates = [];
  instructor: FormArray;
  matcher = new MyErrorStateMatcher();

  loading: Boolean = false;

  frequencyDays = [
    { id: '0', day: 'Sunday',disabled: true },
    { id: '1', day: 'Monday',disabled: true},
    { id: '2', day: 'Tuesday',disabled: true },
    { id: '3', day: 'Wednesday',disabled: true },
    { id: '4', day: 'Thursday',disabled: true },
    { id: '5', day: 'Friday',disabled: true },
    { id: '6', day: 'Saturday',disabled: true }
  ];

  constructor(public _clientService: ClientService, public _courseService: CourseService, public _instructorService: InstructorService, public _jobService: JobService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public formBuilder: FormBuilder, public dialogRef: MatDialogRef<AddJobModalComponent>) {}

  ngOnInit() {
    this.addJobForm = this.formBuilder.group({
      title: new FormControl('', Validators.required),
      jobColor: new FormControl('', Validators.required),
      client: new FormControl(''),
      instructor: new FormArray([this.createInstructor()]),
      location: new FormControl(''),
      course: new FormArray([this.course()]),
      date: new FormControl('', Validators.required),
      frequency: new FormArray([]),
      singleJobDate: new FormControl(),
      totalDays: new FormControl()
    });
    this.addCheckboxes();
    this.finalCourseDates = [];

    this.getClients();
    this.getCourses();
    this.getInstructors();
  }
  
  createInstructor(): FormGroup{
    return this.formBuilder.group({
      singleInstructor : new FormControl('')
    })
  }
  course(): FormGroup{
    return this.formBuilder.group({
      course: new FormControl('')
    })
  }

  addInstructor(){
    this.instructor = this.addJobForm.get('instructor') as FormArray;
    this.instructor.push(this.createInstructor())
  }
  removeInstructor() {
    this.instructor.removeAt(this.instructor.length - 1);
  }

  addCheckboxes() {
    this.frequencyDays.forEach(() => {
        const control = new FormControl();
      (this.addJobForm.controls.frequency as FormArray).push(control);
    });
  }

  searchDays($event){
    this.frequencyDays.forEach(item => item.disabled = false);
    this.startingDate = $event.value;
    // this.courseDates.push(this.startingDate)
    this.temp = moment($event.value);
  }

  onCheckChange(event, dayOfTheWeek, day){
    this.duration = this.addJobForm.get('course').controls[0].value.course.duration
    console.log(this.addJobForm.get('course').controls[0].value.course.duration)

    if(event == true){
      if(this.startingDate.getDay() == dayOfTheWeek){
        console.log(this.startingDate.getDay() ,'==', dayOfTheWeek)
        this.courseDates.push(this.startingDate)
      }
      this.totalDays.push(day)

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
        if(this.totalDays[i] == day){
              this.totalDays.splice(i,1)
            }
      }
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
    console.log(this.addJobForm.controls['course'].value)
    this.loading = true;    
    if(this.addJobForm.valid)
    {
      this.addJobForm.controls['singleJobDate'].setValue(this.finalCourseDates.slice(0,this.duration));
      this.addJobForm.controls['totalDays'].setValue(this.totalDays);

      this._jobService.addJob(this.addJobForm.value).subscribe(data=>{
        this.data = data;
        this.loading = false;
        this.dialogRef.close(this.addJobForm.value);
      },err=>{
          alert("Error adding job.")
          this.loading = false;
          this.dialogRef.close();
      })
      this.dialogRef.close(this.addJobForm.value);
    }
    else{
      console.log("Invalid")
    }
  }

  /* GET clitents */
  getClients() {
    var that = this;
    this._clientService.getClients().subscribe((clients) => {
      this.clients = clients;
    });
  }

  /* GET courses */
  getCourses() {
    var that = this;
    this._courseService.getCourses().subscribe((courses) => {
      this.courses = courses;
    });
  }
  
  /* GET instructors */
  getInstructors() {
    var that = this;
    this._instructorService.getInstructors().subscribe((instructors) => {
      this.instructors = instructors;
    });
  }
}
