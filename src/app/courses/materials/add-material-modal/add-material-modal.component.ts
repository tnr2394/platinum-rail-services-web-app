import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialService } from "../../../services/material.service";

@Component({
  selector: 'app-add-material-modal',
  templateUrl: './add-material-modal.component.html',
  styleUrls: ['./add-material-modal.component.scss']
})
export class AddMaterialModalComponent implements OnInit {
  loading: Boolean = false;
  data: any;
  isMaterial: Boolean = false;
  disabled: Boolean = false;
  isValid: boolean;
  disableUnit: boolean = false
  ngOnInit() {
    console.log("ON INIT", this.dialogData);
    if (this.dialogData.material != undefined) {
      console.log("data", this.data)
      this.data = JSON.parse(JSON.stringify(this.dialogData.material)) 
      console.log("**In if", this.data);
      // this.data.title = this.dialogData.material.title
      // console.log("this.data.title=====>>>>>", this.data.title);
      // alert(this.data.title)
      // this.data.unitNo = this.dialogData.material.unitNo
      // this.data.type = this.dialogData.material.type
      this.isMaterial = true;
      this.disabled = true
    }else if (this.dialogData.data) {
      console.log("call this or not")
      // this.data.unitNo = this.dialogData.data
      this.disableUnit = true
      this.disabled = true
      this.data = this.dialogData.data
    }
    else { 
      this.data = this.dialogData; this.disabled = false 
    }

    console.log("** Data is final as render", this.data);

  }
  constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public dialogData: any, public _materialService: MaterialService) {
    // NO DEFINITION
  }

  doSubmit() {
    console.log("this.data.title", this.data.title);

    if (this.data.type == "" || this.data.type == undefined || this.data.title == "" || this.data.title == undefined) {
      this.isValid = false;
      console.log("this.data.type == ''", this.isValid);
    }
    else if (this.data.type == "Reading") {
      this.isValid = (this.data.title != "" || this.data.title != undefined) ? true : false
      console.log("this.data.type == 'READING'", this.isValid);
    }
    else if (this.data.type == "Assignment") {
      this.isValid = this.data.title != "" ? true : false
      console.log("this.data.title !='ASSSIGNMENT'", this.isValid);
      this.isValid = (this.data.unitNo >= '0' && this.data.assignmentNo >= '0') ? true : false
      console.log("this.data.unitNo >= 0 && this.data.assignmentNo >= 0", this.isValid);
    }
    console.log("this.isValid", this.isValid);

    if (this.isValid == true) {
      if (this.isMaterial == true) {
        this._materialService.editMaterial(this.data).subscribe(data => {
          this.data = data;
          this.loading = false;
          this.dialogRef.close(data);
        }, err => {
          alert("Error editing Material.")
          this.loading = false;
          this.dialogRef.close();
        })
      }
      else {
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
    else {

    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
