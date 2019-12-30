import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ClientService } from "../../services/client.service";
declare var $;

export interface Client {
  _id: string;
  name: string;
  email: string;
};

@Component({
  selector: 'app-add-client-modal',
  templateUrl: './add-client-modal.component.html',
  styleUrls: ['./add-client-modal.component.scss']
})
export class AddClientModalComponent implements OnInit {
  loading: Boolean = false;
  confirmPassword = new FormControl('');
  passwordMismatch: boolean;
  show: boolean;
  pwd: boolean;
  show1: boolean;
  pwd1: boolean;

  ngOnInit() {
    this.confirmPassword.setErrors({
      nomatch: true
    });

    $("#password").click(function () {
      $("#password").toggleClass("fa-eye fa-eye-slash");
    });

    $("#cpassword").click(function () {
      $("#password").toggleClass("fa-eye fa-eye-slash");
    });
  }
  constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any, public _clientService: ClientService, private formBuilder: FormBuilder) {
    // NO DEFINITION
  }

  validate(data) {
    console.log("Validating ", data);
    if (!data.name) return false;
    if (!data.email) return false;
    if (!data.password) return false;
    if (!data.confirmPassword) return false;
    if (data.password !== data.confirmPassword) {
      this.passwordMismatch = true;
      return false;
    }
    this.passwordMismatch = false;
    return true;
  }

  doSubmit() {
    console.log("Submit ", this.data);
    console.log("Validating = ", this.validate(this.data));
    if (!this.validate(this.data)) {
      console.log("RETURNING");
      return;
    }


    // Do Submit
    this.loading = true;
    this._clientService.addClient(this.data).subscribe(data => {
      this.data = data;
      this.loading = false;
      console.log("Added Successfully", data);
      this.dialogRef.close(data);

    }, err => {
      alert("Error Adding Client.")
      this.loading = false;
      this.dialogRef.close(null);

    });

  }


  password() {
    this.show = !this.show;
    this.pwd = !this.pwd;
  }

  cpassword() {
    this.show1 = !this.show1;
    this.pwd1 = !this.pwd1
  }



  onNoClick(): void {
    this.dialogRef.close();
  }
}
