import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormGroupDirective, FormArray, NgForm, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, throwToolbarMixedModesError } from '@angular/material';
import { ErrorStateMatcher } from '@angular/material/core';
import * as moment from 'moment';
import * as _ from 'lodash';

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
  newTitle;
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
  deletedInstructor = [];
  jobDateComponent: JobDatesComponent;
  selectedInstructorsForDb = [];
  deletedInstructorsForDb = [];
  selectedInstructors;
  selectedCourseNew;
  selectedClientNew;
  selectedCourseNameNew;
  selectedClientNameNew;
  minDate: any;

  frequencyDays = [
    { id: '0', day: 'Sunday', checked: false },
    { id: '1', day: 'Monday', checked: false },
    { id: '2', day: 'Tuesday', checked: false },
    { id: '3', day: 'Wednesday', checked: false },
    { id: '4', day: 'Thursday', checked: false },
    { id: '5', day: 'Friday', checked: false },
    { id: '6', day: 'Saturday', checked: false }
  ];
  rgba: any;
  always: any;

  clientChanged(data) {
    this.selectedClient = data.value;
    console.log(this.selectedClient);
    this.addJobForm.controls['client'].setValue(data.value)
    console.log(this.addJobForm.value)
  }
  locationChanged(data) {
    console.log("Location", data.value)
    this.addJobForm.controls['location'].setValue(data.value)
  }

  constructor(public _clientService: ClientService, public _courseService: CourseService, public _instructorService: InstructorService, public _jobService: JobService,
    @Inject(MAT_DIALOG_DATA) public data: any, @Inject(MAT_DIALOG_DATA) public DialogData: any,
    public formBuilder: FormBuilder, public dialogRef: MatDialogRef<EditJobModalComponent>) { }

  ngOnInit() {
    console.log("The data recieved is", this.DialogData);

    this.minDate = new Date();

    this.DialogData.totalDays.forEach((day) => {
      this.totalDays.push(day)
    })
    this.DialogData.singleJobDate.forEach((date) => {
      this.singleJobDate.push(date)
    });

    this.selectedCourseNew = this.DialogData.course._id;

    this.color = this.DialogData.color;
    console.log("Dialog Data color", this.DialogData.color)
    this.addJobForm = this.formBuilder.group({
      title: new FormControl(this.DialogData.title),
      jobColor: new FormControl(''),
      client: new FormControl(),
      instructor: new FormControl(),
      location: new FormControl(),
      course: new FormArray([]),
      startingDate: new FormControl(new Date(this.DialogData.startingDate)),
      // frequency: new FormArray([]),
      singleJobDate: new FormControl(),
      totalDays: new FormControl()
    });
    // this.selectedInstructor.forEach((item) => {
    //   console.log("LOOK AT ME!!!")
    //   this.instructorData = item
    // })
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

  addCourse(x) {
    this.course = this.addJobForm.get('course') as FormArray;
    this.course.push(this.createCourse(x))
  }
  // addInstructor(data?: any) {
  //   console.log("IN CREATING INSTRUCTOR", data)
  //   this.instructor = this.addJobForm.get('instructor') as FormArray;
  //   this.instructor.push(this.createInstructor(data))
  // }
  removeInstructor() {
    this.instructor.removeAt(this.instructor.length - 1);
  }
  getChecked() {
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

  getDates() {
    this.DialogData.singleJobDate.forEach((item) => {
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

  courseChanged(event) {
    console.log('EVENT', event.value)
    this.selectedCourse = event.value;
    this.duration = event.value.duration
    this.selectedCourseNew = event.value._id;
    this.selectedCourseNameNew = event.value.title;
  }

  daySelection(obj) {
    console.log("-----DAY SELECTION EVENT-----", obj)
    console.log("OBJ", obj)
    this.singleJobDate = obj.singleJobDates;
    this.totalDays = obj.totalDays;
  }

  addJob() {
    let InstructorsID = [];
    let InstructorsName = [];

    if (this.addJobForm.controls['client'].value == null) {
      this.addJobForm.controls['client'].setValue(this.DialogData.client._id);
    }

    if (this.addJobForm.controls['client'].value != this.DialogData.client._id && this.addJobForm.controls['location'].value == null) {
      this.addJobForm.invalid;
      console.log('select Location')
    }
    if (this.addJobForm.controls['client'].value == this.DialogData.client._id && this.addJobForm.controls['location'].value == null) {
      this.addJobForm.controls['location'].setValue(this.DialogData.location)
    }
    if (this.addJobForm.controls['client'].value != null && this.addJobForm.controls['location'].value != null) {
      this.addJobForm.valid;
    }

    if (this.addJobForm.controls['startingDate'].value.getDate() == new Date(this.DialogData.startingDate).getDate() &&
      this.addJobForm.controls['startingDate'].value.getDay() == new Date(this.DialogData.startingDate).getDay()) {
      console.log('the job dates are empty && giving it the old values')
      this.addJobForm.controls['singleJobDate'].setValue(this.DialogData.singleJobDate)
      this.addJobForm.controls['totalDays'].setValue(this.DialogData.totalDays)
    }
    else {
      console.log("Cannot set value as the starting date changed")
      this.addJobForm.controls['totalDays'].setValue(this.totalDays)
    }

    this.selectedInstructor.forEach((item) => {
      this.selectedInstructorsForDb.push(item._id)
    })

    this.DialogData.instructors.forEach((item) => {
      this.deletedInstructorsForDb.push(item._id)
    })

    this.deletedInstructor = _.difference(this.deletedInstructorsForDb, this.selectedInstructorsForDb)

    if (this.addJobForm.controls['title'].value) {
      this.newTitle = this.addJobForm.controls['title'].value
    } else {
      this.newTitle = this.selectedClient.name + '-' + this.selectedCourseNameNew;
    }


    let editedJob = {
      title: this.newTitle,
      jobColor: this.addJobForm.controls['jobColor'].value,
      client: this.selectedClient._id,
      location: this.addJobForm.controls['location'].value._id,
      instructor: this.selectedInstructorsForDb,
      course: this.selectedCourseNew,
      startingDate: this.addJobForm.controls['startingDate'].value,
      totalDays: this.totalDays,
      singleJobDate: this.singleJobDate,
      removedInstructor: this.deletedInstructor
    }

    console.log('Edited Job:', editedJob);


    // return;


    let dataToDisplay = {
      title: this.newTitle,
      color: this.addJobForm.controls['jobColor'].value,
      client: this.selectedClient,
      location: this.addJobForm.controls['location'].value,
      instructor: InstructorsID,
      instructors: InstructorsName,
      course: this.selectedCourseNew,
      startingDate: this.addJobForm.controls['startingDate'].value,
      totalDays: this.totalDays,
      singleJobDate: this.singleJobDate,
      _id: this.DialogData._id
    }

    console.log('Edited Job:', dataToDisplay);


    let id = this.DialogData._id
    this.loading = true;
    if (this.addJobForm.valid) {
      this._jobService.editJobs(editedJob, id).subscribe(data => {
        this.data = dataToDisplay;
        this.loading = false;
        this.closoeDialog({
          action: 'edit',
          result: 'success',
          data: dataToDisplay
        });
      }, err => {
        alert("Error editing instructor.")
        this.loading = false;
        this.closoeDialog({
          action: 'edit',
          result: 'err',
          data: err
        });
      });
    }
    else {
      console.log("Invalid")
    }
  }

  delete() {
    let id = this.DialogData._id
    this._jobService.deleteJobs(id).subscribe(data => {
      this.data = this.DialogData;
      this.loading = false;
      this.closoeDialog({
        action: 'delete',
        result: 'success',
        data: this.DialogData
      });
    }, err => {
      alert("Error deleting instructor.")
      this.loading = false;
      this.closoeDialog({
        action: 'delete',
        result: 'err',
        data: err
      });
    });
  }
  closoeDialog(result) {
    this.dialogRef.close(result);
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
        if (this.DialogData.client._id === client._id) {
          console.log("Same at", i)
          this.selectedClient = this.clients[i]

          let j = 0;
          client.locations.forEach((location) => {
            if (this.DialogData.location._id === location._id) {
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
      this.courses.forEach((course) => {
        if (course._id === this.DialogData.course._id) {
          this.selectedCourse = this.courses[i];
          this.duration = this.courses[i].duration;
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
      this.DialogData.instructors.forEach((id) => {
        this.instructors.forEach((item) => {
          if (item._id == id._id) {
            this.selectedInstructor.push(item)
          }
        })
      })
      this.addJobForm.controls.instructor.setValue(this.selectedInstructor);
    });
  }

  instructorChanged(data) {
    this.selectedInstructor = data.value;
  }
}
