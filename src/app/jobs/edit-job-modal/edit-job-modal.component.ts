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
  selector: 'app-edit-job-modal',
  templateUrl: './edit-job-modal.component.html',
  styleUrls: ['./edit-job-modal.component.scss']
})
export class EditJobModalComponent implements OnInit {

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

  // 
  title;
  color;
  client;
  selected;
  instructorData;

  loading: Boolean = false;

  frequencyDays = [
    { id: '0', day: 'Sunday', checked: false },
    { id: '1', day: 'Monday', checked: false },
    { id: '2', day: 'Tuesday', checked: false },
    { id: '3', day: 'Wednesday', checked: false },
    { id: '4', day: 'Thursday', checked: false },
    { id: '5', day: 'Friday', checked: false },
    { id: '6', day: 'Saturday', checked: false }
  ];

  constructor(public _clientService: ClientService, public _courseService: CourseService, public _instructorService: InstructorService, public _jobService: JobService,
    @Inject(MAT_DIALOG_DATA) public data: any, @Inject(MAT_DIALOG_DATA) public DialogData: any,
    public formBuilder: FormBuilder, public dialogRef: MatDialogRef<EditJobModalComponent>) { }

  ngOnInit() {
    
    console.log('-----DATA-----', this.DialogData)
    // console.log('Client', this.DialogData.client)
    let newDate = new Date(this.DialogData.startingDate)
    console.log("+++++++++++", newDate)
    this.color = this.DialogData.color;
    this.addJobForm = this.formBuilder.group({
      title: new FormControl(this.DialogData.title),
      jobColor: new FormControl(''),
      client: new FormControl(this.DialogData.client),
      instructor: new FormArray([this.createInstructor(this.DialogData.instructor[0].singleInstructor)]),
      location: new FormControl(this.DialogData.location),
      course: new FormArray([this.course(this.DialogData.course)]),
      startingDate: new FormControl(new Date(this.DialogData.startingDate)),
      frequency: new FormArray([]),
      singleJobDate: new FormControl(),
      totalDays: new FormControl()
    });
    this.addCheckboxes();

    this.getClients();
    this.getCourses();
    this.getInstructors();
    this.getChecked();
    this.getDates();

    for (var i = 1; i < this.DialogData.instructor.length; i++) {
      console.log("LOOK AT ME!!!")
      this.instructorData = this.DialogData.instructor[i].singleInstructor
      this.addInstructor(this.instructorData)
      console.log(this.instructorData);
    }
  }

  createInstructor(data): FormGroup {
    return this.formBuilder.group({
      singleInstructor: new FormControl(data)
    })
  }

  course(data): FormGroup {
    return this.formBuilder.group({
      course: new FormControl()
      // this.DialogData.course[0].course.title
    })
  }

  addInstructor(data) {
    this.instructor = this.addJobForm.get('instructor') as FormArray;
    this.instructor.push(this.createInstructor(data))
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
  getChecked(){
    console.log("IN CHECKED");
    this.frequencyDays.forEach((item) => {
      for (var i = 0; i < this.DialogData.totalDays.length; i++) {
        if (item.day == this.DialogData.totalDays[i]) {
          console.log("in for loop", item, i)
          item.checked = true;
        }
      }
    });
  }

  getDates(){
    this.DialogData.singleJobDate.forEach((item)=>{
      let temp = new Date(item)
      this.finalCourseDates.push(temp)
    })
  }

  searchDays($event) {
    this.startingDate = $event.value;
    this.temp = moment($event.value);
  }

  onCheckChange(event, dayOfTheWeek, day) {
    this.duration = this.addJobForm.get('course').controls[0].value.course.duration
    console.log(this.addJobForm.get('course').controls[0].value.course.duration)

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
  }

  datesForJobChange($event, index) {
    this.finalCourseDates[index] = this.addJobForm.controls.singleJobDate.value
  }

  addJob() {
    // console.log(this.addJobForm.get('course').value)
    let id = (this.DialogData._id)
    console.log("VALUE",this.addJobForm.value)
    this.loading = true;
    // if (this.addJobForm.valid) {
      // this.addJobForm.controls['singleJobDate'].setValue(this.finalCourseDates.slice(0, this.duration));
    if (this.addJobForm.controls['totalDays'].value == null){
      this.DialogData.totalDays.forEach((item)=>{
        this.addJobForm.controls['totalDays'].setValue(item)    
      })
      this.addJobForm.controls['totalDays'].setValue(this.DialogData.totalDays)
    }
    
    else { this.addJobForm.controls['totalDays'].setValue(this.totalDays)}

      this._jobService.editJobs(this.addJobForm.value, id).subscribe(data => {
        // this.data = data;
        this.loading = false;
        this.dialogRef.close(this.addJobForm.value);
      }, err => {
        alert("Error adding job.")
        this.loading = false;
        this.dialogRef.close();
      })
      this.dialogRef.close(this.addJobForm.value);
    // }
    // else {
    //   console.log("Invalid")
    // }
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
