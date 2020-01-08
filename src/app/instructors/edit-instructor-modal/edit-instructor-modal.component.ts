import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// import { instructor } from 'src/app/interfaces/instructor';
import { InstructorService } from '../../services/instructor.service'
import { format } from 'url';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import * as _ from 'lodash';
declare var $;


export interface Instructor {
  _id: string;
  name: string;
  dateOfJoining: Date;
  email: string;
  password: string;
  qualifications: []
};


@Component({
  selector: 'app-edit-instructor-modal',
  templateUrl: './edit-instructor-modal.component.html',
  styleUrls: ['./edit-instructor-modal.component.scss']
})
export class EditInstructorModalComponent implements OnInit {
  loading: Boolean = false;
  instructorData;
  passwordMismatch: boolean;
  certFile: any = [];
  show: boolean;
  pwd: boolean;
  show1: boolean;
  pwd1: boolean;
  url1: any;
  profileFile: any = [];
  url;

  ngOnInit() {

    console.log("DATA = ", this.data);
    this.instructorData = JSON.parse(JSON.stringify(this.data));
    // this.instructorData.dateOfJoining = this.formatDate(this.instructorData.dateOfJoining);
    console.log("DATE = ", this.instructorData.dateOfJoining);
    this.instructorData.confirmPassword = this.instructorData.password;

    $("#password").click(function () {
      $("#password").toggleClass("fa-eye fa-eye-slash");
    });

    $("#cpassword").click(function () {
      $("#cpassword").toggleClass("fa-eye fa-eye-slash");
    });
  }
  constructor(public dialogRef: MatDialogRef<Instructor>, @Inject(MAT_DIALOG_DATA) public data: any, public _instructorService: InstructorService) {
    // NO DEFINITION
  }
  validate(data) {
    console.log("Validating ", data);
    if (!data.name) return false;
    if (!data.email) return false;
    if (!data.password) return false;
    if (!data.dateOfJoining) return false;
    if (!data.confirmPassword) return false;
    if (data.password !== data.confirmPassword) {
      console.log("Password Mismatch")
      this.passwordMismatch = true;
      return false;
    }
    this.passwordMismatch = false;
    return true;
  }



  formatDate(date) {
    var d = new Date(date);
    return d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
  }

  password() {
    this.show = !this.show;
    this.pwd = !this.pwd;
  }

  cpassword() {
    this.show1 = !this.show1;
    this.pwd1 = !this.pwd1
  }

  doSubmit() {
    console.log("Submit ", this.data);
    console.log("this.instructorData", this.instructorData);

    const data = new FormData();
    _.forOwn(this.instructorData, (value, key) => {
      if (key == 'competencies') {
        for (let i = 0; i < this.instructorData.competencies.length; i++) {
          data.append(key, this.instructorData.competencies[i]);
        }
      } else {
        data.append(key, value);
      }
    });


    if (this.certFile.length) {
      for (let i = 0; i <= this.certFile.length; i++) {
        data.append('file', this.certFile[i]);
      }
    }

    if (this.profileFile.length) {
      for (let i = 0; i <= this.profileFile.length; i++) {
        data.append('profile', this.profileFile[i]);
      }
    }

    console.log('Data-------------->>>>>', data);


    // console.log("Validating = ", this.validate(this.data));
    // if (!this.validate(this.instructorData)) {
    //   console.log("RETURNING");
    //   return;
    // }

    // Do Submit
    this.loading = true;
    this._instructorService.editInstructor(data).subscribe(instructors => {
      this.data = this.instructorData;
      this.loading = false;
      this.closoeDialog({
        action: 'edit',
        result: 'success',
        data: this.instructorData
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

  delete() {
    console.warn("DELETING ", this.data._id);
    this.loading = true;
    this._instructorService.deleteInstructor(this.instructorData._id).subscribe(instructors => {
      this.data = instructors;
      this.loading = false;
      this.closoeDialog({
        action: 'delete',
        result: 'success',
        data: this.instructorData
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


  // for image preview on edit click
  public addFile(event: any) {
    this.certFile = event.target.files;

    console.log('this.certFile', this.certFile);
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.url = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }

  }

  public addProfileImage(event: any) {
    this.profileFile = event.target.files;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.url1 = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }

  }

  closoeDialog(result) {
    this.dialogRef.close(result);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  // title = 'angular-image-uploader';

  // imageChangedEvent: any = '';
  // croppedImage: any = '';

  // fileChangeEvent(event: any): void {
  //   this.imageChangedEvent = event;
  // }
  // imageCropped(event: ImageCroppedEvent) {
  //   this.croppedImage = event.base64;
  //   console.log(' this.croppedImage', this.croppedImage);
  // }
  // imageLoaded() {
  //   // show cropper
  // }
  // cropperReady() {
  //   // cropper ready
  // }
  // loadImageFailed() {
  //   // show message
  // }


}
