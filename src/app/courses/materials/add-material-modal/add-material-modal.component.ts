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
  disabled: boolean;
  ngOnInit() {
    console.log("ON INIT", this.dialogData);
    if(this.dialogData.material != undefined){
      this.data = this.dialogData.material
      this.isMaterial = true;
      this.disabled = true;
    }
    else this.data = this.dialogData; this.disabled = false
  }
  constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public dialogData: any, public _materialService: MaterialService) {
    // NO DEFINITION
  }
  
  doSubmit(){
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
  
  onNoClick(): void {
    this.dialogRef.close();
  }
}
