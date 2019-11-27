import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormGroupDirective, FormArray, NgForm, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, throwToolbarMixedModesError } from '@angular/material';
import { ErrorStateMatcher } from '@angular/material/core';
import * as moment from 'moment';

import { ClientService } from '../../services/client.service';
import { CourseService } from '../../services/course.service';
import { InstructorService } from '../../services/instructor.service';
import { JobService } from '../../services/job.service';
import { JobDatesComponent } from '../job-dates/job-dates.component'

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
  course: FormArray;
  matcher = new MyErrorStateMatcher();
 
  title;
  color;
  client;
  selected;
  instructorData;
  singleJobDate = [];

  loading: Boolean = false;
  selectedClient;
  selectedLocation;
  selectedCourse;
  selectedInstructor = [];
  jobDateComponent : JobDatesComponent;
  
  frequencyDays = [
    { id: '0', day: 'Sunday', checked: false },
    { id: '1', day: 'Monday', checked: false },
    { id: '2', day: 'Tuesday', checked: false },
    { id: '3', day: 'Wednesday', checked: false },
    { id: '4', day: 'Thursday', checked: false },
    { id: '5', day: 'Friday', checked: false },
    { id: '6', day: 'Saturday', checked: false }
  ];

  clientChanged(data) {
    this.selectedClient = data.value;
    console.log(this.selectedClient);
    this.addJobForm.controls['client'].setValue(data.value)
    console.log(this.addJobForm.value)
  }
  locationChanged(data){
    console.log("Location",data.value)
    this.addJobForm.controls['location'].setValue(data.value)
  }

  constructor(public _clientService: ClientService, public _courseService: CourseService, public _instructorService: InstructorService, public _jobService: JobService,
    @Inject(MAT_DIALOG_DATA) public data: any, @Inject(MAT_DIALOG_DATA) public DialogData: any,
    public formBuilder: FormBuilder, public dialogRef: MatDialogRef<EditJobModalComponent>) { }

  ngOnInit() {
    this.DialogData.totalDays.forEach((day)=>{
      this.totalDays.push(day)
    })        
    this.DialogData.singleJobDate.forEach((date)=>{
      this.singleJobDate.push(date)
    })

    this.color = this.DialogData.color;
    this.addJobForm = this.formBuilder.group({
      title: new FormControl(this.DialogData.title),
      jobColor: new FormControl(''),
      client: new FormControl(),
      instructor: new FormArray([]),
      location: new FormControl(),
      course: new FormArray([]),
      startingDate: new FormControl(new Date(this.DialogData.startingDate)),
      frequency: new FormArray([]),
      singleJobDate: new FormControl(),
      totalDays: new FormControl()
    });
    this.selectedInstructor.forEach((item)=>{
      console.log("LOOK AT ME!!!")
      this.instructorData = item
    })
    this.startingDate = new Date(this.DialogData.startingDate)

    this.getClients();
    this.getCourses();
    this.getInstructors();
    this.getChecked();
    this.getDates();
  }
  createInstructor(data): FormGroup {
    return this.formBuilder.group({
      singleInstructor: new FormControl(data)
    })
  }

  createCourse(data): FormGroup {
    console.log("IN COURSE CREATION", data)
    return this.formBuilder.group({
      course: new FormControl(data)
    })
  }

  addCourse(x){
    this.course = this.addJobForm.get('course') as FormArray;
    this.course.push(this.createCourse(x))
  }
  addInstructor(data) {
    this.instructor = this.addJobForm.get('instructor') as FormArray;
    this.instructor.push(this.createInstructor(data))
  }
  removeInstructor() {
    this.instructor.removeAt(this.instructor.length - 1);
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

  datesForJobChange($event, index) {
    this.finalCourseDates[index] = this.addJobForm.controls.singleJobDate.value
  }

  addJob() {
    // console.log(this.addJobForm.get('course').value)
    if(this.addJobForm.controls['client'].value == null){
      this.addJobForm.controls['client'].setValue(this.DialogData.client)
    }
    // console.log("Dialog locations", this.DialogData.location)
    if (this.addJobForm.controls['location'].value == null) {
      this.addJobForm.controls['location'].setValue(this.DialogData.location)
    }

    let id = (this.DialogData._id)
    console.log("ALL INSTRUCTORS", this.selectedInstructor)

    console.log("VALUE",this.addJobForm.value)
    
    // this.loading = true;
    // // if (this.addJobForm.valid) {
    //   // this.addJobForm.controls['singleJobDate'].setValue(this.finalCourseDates.slice(0, this.duration));
    // if (this.addJobForm.controls['totalDays'].value == null){
    //   this.DialogData.totalDays.forEach((item)=>{
    //     this.addJobForm.controls['totalDays'].setValue(item)    
    //   })
    //   this.addJobForm.controls['totalDays'].setValue(this.DialogData.totalDays)
    // }
    
    // else { this.addJobForm.controls['totalDays'].setValue(this.totalDays)}

    //   this._jobService.editJobs(this.addJobForm.value, id).subscribe(data => {
    //     // this.data = data;
    //     this.loading = false;
    //     this.dialogRef.close(this.addJobForm.value);
    //   }, err => {
    //     alert("Error adding job.")
    //     this.loading = false;
    //     this.dialogRef.close();
    //   })
    //   this.dialogRef.close(this.addJobForm.value);
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
      console.log("Getting clients for edit model", this.clients)
      let i = 0;
      this.clients.forEach((client) => {
        console.log("TEST")
        if ( this.DialogData.client._id === client._id ){
          console.log("Same at", i)
          this.selectedClient = this.clients[i]

          let j = 0; 
          client.locations.forEach((location)=>{
            
            if( this.DialogData.location._id === location._id){
              console.log("index at same location is", j)
              this.selectedLocation = this.clients[i].locations[j]
            }
            j += 1;
          })
        }
        i += 1;
      });
    });
  }

  /* GET courses */
  getCourses() {
    var that = this;
    this._courseService.getCourses().subscribe((courses) => {
      this.courses = courses;
      console.log("COURSES", this.courses)
      console.log("DIALOG DATA", this.DialogData.course)
      let i = 0;
      this.courses.forEach((course) =>{
        if( course._id === this.DialogData.course._id){
          this.selectedCourse = this.courses[i];
          this.addCourse(course)
        }
        i += 1;
      })
    });
  }

  /* GET instructors */
  getInstructors() {
    var that = this;
    this._instructorService.getInstructors().subscribe((instructors) => {
      this.instructors = instructors;

      this.DialogData.instructor.forEach((id)=>{
        this.instructors.forEach((item)=>{
          if(item._id == id){
            this.selectedInstructor.push(item)
          }
        })
      })
      this.selectedInstructor.forEach((item) => {
        this.addInstructor(item)
      })
    });
  }
}
