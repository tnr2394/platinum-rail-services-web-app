import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MaterialService } from "../../../services/material.service";

@Component({
  selector: 'app-add-material-modal',
  templateUrl: './add-material-modal.component.html',
  styleUrls: ['./add-material-modal.component.scss']
})
export class AddMaterialModalComponent  implements OnInit {
  loading: Boolean = false;
  data: any;
  isMaterial: Boolean = false;
  disabled: Boolean = false;
  isValid: boolean;
  ngOnInit() {
    console.log("ON INIT", this.dialogData);
    if(this.dialogData.material != undefined){
      this.data = this.dialogData.material
      this.isMaterial = true;
      this.disabled = true
    }
    else this.data = this.dialogData
  }
  constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public dialogData: any, public _materialService: MaterialService) {
    // NO DEFINITION
  }
  
  doSubmit(){
    console.log("this.data.title", this.data.title);
    
    if (this.data.type == "" || this.data.type == undefined|| this.data.title == "" || this.data.title == undefined)
    {
      this.isValid = false;
      console.log("this.data.type == ''", this.isValid);
    }
    else if (this.data.type == "Reading"){
      this.isValid = (this.data.title != "" || this.data.title != undefined) ? true : false
      console.log("this.data.type == 'READING'", this.isValid);
    }
    else if (this.data.type == "Assignment"){
      this.isValid = this.data.title != "" ? true : false
      console.log("this.data.title !='ASSSIGNMENT'", this.isValid);
      this.isValid = (this.data.unitNo >= '0' && this.data.assignmentNo >= '0') ? true : false
      console.log("this.data.unitNo >= 0 && this.data.assignmentNo >= 0", this.isValid);
    }
    console.log("this.isValid", this.isValid);
    
    if(this.isValid == true){
        if(this.isMaterial == true){
        this._materialService.editMaterial(this.data).subscribe(data=>{
        this.data = data;
        this.loading = false;
        this.dialogRef.close(data);
      }, err => {
        alert("Error editing Material.")
        this.loading = false;
        this.dialogRef.close();
      })
    }
    else{
      console.log("Submit ", this.data);
      // Do Submit
      this.loading = true;
      this._materialService.addMaterial(this.data).subscribe(data => {
        this.data = data;
        this.loading = false;
        this.dialogRef.close(data);

      }, err => {
        alert("Error editing Material.")
        this.loading = false;
        this.dialogRef.close();
      });
    }
    }
    else{
     
    }
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }
}
