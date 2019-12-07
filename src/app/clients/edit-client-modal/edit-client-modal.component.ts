import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Course } from 'src/app/interfaces/course';
import {ClientService} from '../../services/client.service'

@Component({
  selector: 'app-edit-client-modal',
  templateUrl: './edit-client-modal.component.html',
  styleUrls: ['./edit-client-modal.component.scss']
})
export class EditClientModalComponent implements OnInit {
  loading: Boolean = false;
  clientData;
  passwordMismatch: boolean;
  ngOnInit() {

    console.log("DATA = ",this.data);
    this.clientData = JSON.parse(JSON.stringify(this.data));
    this.data.confirmPassword = this.data.password;
  }
  constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any, public _clientService: ClientService) {
      // NO DEFINITION
  }

  validate(data){
    console.log("Validating ",data);
    if(!data.name) return false;
    if(!data.email) return false;
    if(!data.password) return false;
    if(!data.confirmPassword) return false;
    if(data.password !== data.confirmPassword){ 
      this.passwordMismatch = true;
      return false;
    }
    this.passwordMismatch = false;
    return true;
  }
  
  doSubmit(){
    console.log("Submit ",this.data);
    console.log("Validating = ",this.validate(this.data));
    if(!this.validate(this.data)){
      console.log("RETURNING");
      return;
    }
  
    // Do Submit
    this.loading = true;
    this._clientService.editClient(this.data).subscribe(client=>{
      this.clientData = client;
      console.log("CLIENTDATA = ",client);
      this.loading = false;
      this.closoeDialog({
        action: 'edit',
        result: 'success',
        data: this.clientData
      });
    },err=>{
      alert("Error editing Client.")
      this.loading = false;
      this.closoeDialog({
        action: 'edit',
        result: 'err',
        data: err
      });
    });
  }

  delete(){
    console.warn("DELETING ",this.data._id);
    this.loading = true;    
    this._clientService.deleteClient(this.clientData._id).subscribe(clients=>{
      // this.data = clients;
      this.loading = false;
      this.closoeDialog({
        action: 'delete',
        result: 'success',
        data: this.clientData
      });
    },err=>{
      alert("Error deleting course.")
      this.loading = false;
      this.closoeDialog({
        action: 'delete',
        result: 'err',
        data: err
      });
    });

  }



  closoeDialog(result){
    this.dialogRef.close(result);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
