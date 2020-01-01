// import { Component, OnInit, ChangeDetectorRef, Inject, HostListener } from '@angular/core';

import { Directive, Component, Output, OnInit, Inject, ChangeDetectorRef, Input, EventEmitter, HostBinding, HostListener } from '@angular/core';


import { FileUploader } from 'ng2-file-upload';
import { post } from 'selenium-webdriver/http';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { MaterialService } from 'src/app/services/material.service';
import { FileService } from 'src/app/services/file.service';
import { LearnerService } from 'src/app/services/learner.service';
import { browser } from 'protractor';
import { ConnectedPositionStrategy } from '@angular/cdk/overlay';

@Component({
  selector: 'app-add-file-modal',
  templateUrl: './add-file-modal.component.html',
  styleUrls: ['./add-file-modal.component.scss']
})
export class AddFileModalComponent implements OnInit {
  loading: Boolean = false;
  fileMaterial: any = [];
  dragAreaClass: string = 'hidden';
  dragAreaContent: string = 'Choose a file or drag it here';


  uploadMaterial = new FormGroup({
    materialfile: new FormControl(),
  });

  ngOnInit(): void {
    console.log("Upload files initialized", this.data);
  }
  constructor(public _snackbar: MatSnackBar, public cd: ChangeDetectorRef, public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any, public _materialService: MaterialService, public _fileService: FileService, public _learnerService: LearnerService) {
    // NO DEFINITION
  }

  files: any = [];

  uploadFile(event, value) {
    if (value == 'browse') {
      for (let index = 0; index < event.target.files.length; index++) {
        const element = event.target.files[index];
        this.files.push(element.name)
      }

      this.fileMaterial = event.target.files;


    } else {
      for (let index = 0; index < event.length; index++) {
        const element = event[index];
        this.files.push(element.name)
      }
      this.fileMaterial = event;
    }
  }


  deleteAttachment(index) {
    console.log('this.files', this.files);
    console.log('this.fileMaterial', this.fileMaterial);
    this.files.splice(index, 1)
    // this.fileMaterial.splice(index, 1)
  }




  // uploadFile(event, field) {

  //   console.log('event------------>>>>>>>>>', event);


  //   if (event.target.files && event.target.files.length) {
  //     console.log('field------------', field);

  //     const [file] = event.target.files;
  //     this.fileMaterial = event.target.files;
  //     // just checking if it is an image, ignore if you want
  //     if (!file.type.startsWith('image')) {
  //       this.uploadMaterial.get(field).setErrors({
  //         required: true
  //       });
  //       this.cd.markForCheck();
  //     } else {
  //       // unlike most tutorials, i am using the actual Blob/file object instead of the data-url
  //       this.uploadMaterial.patchValue({
  //         [field]: file
  //       });
  //       // need to run CD since file load runs outside of zone
  //       this.cd.markForCheck();
  //     }
  //   }
  // }


  doSubmit() {
    console.log("Submit ", this.data);

    if (this.data.allotmentId) {
      console.log('Inside If:');

      console.log('this.fileMaterial', this.fileMaterial);


      let formData = new FormData();
      formData.set('allotmentId', this.data.allotmentId);
      formData.set('status', this.data.status);

      console.log('this.data.status:', this.data.status);

      if (this.fileMaterial.length > 0) {
        for (let i = 0; i <= this.fileMaterial.length; i++) {
          formData.append('file', this.fileMaterial[i]);
        }
      }

      // Do Submit
      this.loading = true;
      this._learnerService.submitAssignment(formData).subscribe(data => {
        this.data = data;
        this.loading = false;
        this.dialogRef.close(data);
        this.openSnackBar("File Uploaded Successfully", "Ok");

      }, err => {
        alert("Error Uploading Files.")
        this.loading = false;
        this.dialogRef.close();

      });
    } else {

      let formData = new FormData();
      formData.set('materialId', this.data.materialId);


      if (this.fileMaterial.length > 0) {
        for (let i = 0; i <= this.fileMaterial.length; i++) {
          formData.append('file', this.fileMaterial[i]);
        }
      }

      // Do Submit
      this.loading = true;
      this._fileService.addFiles(formData).subscribe(data => {
        this.data = data;
        this.loading = false;
        this.dialogRef.close(data);
        this.openSnackBar("File uploaded successfully.", "Ok");
      }, err => {
        alert("Error Uploading Files.")
        this.loading = false;
        this.dialogRef.close();

      });

    }

  }

  openSnackBar(message: string, action: string) {
    this._snackbar.open(message, action, {
      duration: 2000,
    });
  }


  onNoClick(): void {
    this.dialogRef.close();
  }
}
