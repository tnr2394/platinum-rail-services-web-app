import { Component, OnInit, Inject, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormGroupDirective, FormArray, NgForm, Validators, } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ErrorStateMatcher } from '@angular/material/core';
import * as moment from 'moment';

import { ClientService } from '../../services/client.service';
import { CourseService } from '../../services/course.service';
import { InstructorService } from '../../services/instructor.service';
import { JobService } from '../../services/job.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { JobDatesComponent } from '../job-dates/job-dates.component';

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
  selectedInstructors;
  selectedInstructorsForDb = [];
  jobDates: FormArray;
  totalDays = [];
  newTitle;
  duration;
  isDisabled: Boolean = false;
  finalCourseDates = [];
  matcher = new MyErrorStateMatcher();
  singleJobDate = [];

  loading: Boolean = false;
  selectedClient = {
    name: "Default",
    _id: ""
  };
  selectedCourse: any;
  color: any;
  rgba: any;
  always: any;
  // minDate: any;
  @ViewChild(JobDatesComponent, { static: false }) jobDateComp: JobDatesComponent;
  constructor(public _clientService: ClientService, public _courseService: CourseService, public _instructorService: InstructorService, public _jobService: JobService,
    @Inject(MAT_DIALOG_DATA) public data: any, private router: Router,
    public formBuilder: FormBuilder, public dialogRef: MatDialogRef<AddJobModalComponent>) { }

  clientChanged(data) {
    this.selectedClient = data.value;
    console.log(this.selectedClient);
  }

  instructorChanged(data) {
    this.selectedInstructors = data.value;
  }

  courseChanged(data) {
    if (this.router.url.includes('/scheduler')) {
      this.jobDateComp.enableCheckBoxes();  
    }
    this.selectedCourse = data.value;
    console.log(this.selectedCourse);
    this.duration = this.selectedCourse.duration;
  }

  daySelection(obj) {
    console.log("-----DAY SELECTION EVENT-----", obj)
    console.log("OBJ", obj)
    this.singleJobDate = obj.singleJobDates;
    this.totalDays = obj.totalDays;
    // obj.singleJobDates.forEach((item) => {
    //   this.singleJobDate.push(item)
    // })
    // obj.totalDays.forEach((item) => {
    //   this.totalDays.push(item)
    // })
  }

  ngOnInit() {
    console.log("ON INIT", this.data);
    // this.minDate = new Date();
    this.createForm();
    this.finalCourseDates = [];
    this.createForm();
    this.getClients();
    this.getCourses();
    this.getInstructors();
  }
  createForm(){
    if (this.router.url.includes('/scheduler')) {
      this.addJobForm = this.formBuilder.group({
        title: new FormControl(this.data.title),
        jobColor: new FormControl('', Validators.required),
        client: new FormControl(''),
        instructor: new FormControl(''),
        location: new FormControl(''),
        course: new FormArray([this.course()]),
        startingDate: new FormControl(this.data.start, Validators.required)
      });
      this.startingDate = this.data.start;
    }
    else{
      this.addJobForm = this.formBuilder.group({
        title: new FormControl(''),
        jobColor: new FormControl('', Validators.required),
        client: new FormControl(''),
        instructor: new FormControl(''),
        location: new FormControl(''),
        course: new FormArray([this.course()]),
        startingDate: new FormControl('', Validators.required)
      });
    }
  }

  course(): FormGroup {
    return this.formBuilder.group({
      course: new FormControl('')
    })
  }

  clearForm() {
    this.jobDateComp.checkEnable = true;
    this.addJobForm.reset();
    this.selectedCourse.duration = null
    console.log("form value---->", this.addJobForm)
    this.ngOnInit();
  }
  searchDays($event) {
    this.jobDateComp.enableCheckBoxes();
    this.duration = this.selectedCourse.duration;
    this.startingDate = $event.value;
    this.temp = moment($event.value);
  }


  datesForJobChange($event, index) {
    this.finalCourseDates[index] = this.addJobForm.controls.singleJobDate.value
  }

  addJob() {

    console.log("Form value = ", this.addJobForm);
    console.log("This.selectedCourse", this.selectedCourse)

    this.loading = true;

    this.isDisabled = true;
    if (this.addJobForm.valid) {
      let InstructorsForDataBase = [];
      let instructorsForJobsPage = [];

      this.selectedInstructors.forEach((item) => {
        this.selectedInstructorsForDb.push(item._id)
      })

      if (this.addJobForm.controls['title'].value) {
        this.newTitle = this.addJobForm.controls['title'].value
      } else {
        this.newTitle = this.selectedClient.name + '-' + this.selectedCourse.title;
      }

      var newJobforDataBase = {
        title: this.newTitle,
        jobColor: this.addJobForm.controls['jobColor'].value,
        client: this.selectedClient._id,
        location: this.addJobForm.controls['location'].value._id,
        instructors: this.selectedInstructorsForDb,
        course: this.selectedCourse._id,
        startingDate: this.addJobForm.controls['startingDate'].value,
        totalDays: this.totalDays,
        singleJobDate: this.singleJobDate
      };

      var newJobforJobsPage = {
        title: this.newTitle,
        client: this.selectedClient,
        location: this.addJobForm.controls['location'].value,
        instructors: this.selectedInstructors,
        course: this.selectedCourse,
        startingDate: this.addJobForm.controls['startingDate'].value,
        singleJobDate: this.singleJobDate,
        totalDays: this.totalDays,
        color: this.addJobForm.controls['jobColor'].value,
      }

      console.log("DATA-----", newJobforDataBase);

      this._jobService.addJob(newJobforDataBase).subscribe(data => {
        this.data = data;
        this.loading = false;
        this.isDisabled = false;
        this.dialogRef.close(newJobforJobsPage);
      }, err => {
        alert("Error adding job.")
        this.loading = false;
        this.dialogRef.close();
      })
      this.dialogRef.close(newJobforJobsPage);
    }
    else {
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
