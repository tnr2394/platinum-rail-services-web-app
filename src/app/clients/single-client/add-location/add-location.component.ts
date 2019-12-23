import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.scss']
})
export class AddLocationComponent implements OnInit {

  data;
  constructor(public dialogRef: MatDialogRef<AddLocationComponent>) { 
    this.data = {
      title: ""
    }
  }

  doAddNewLocation(data){
    if(this.data.title == ""){
      console.log("Empty")
    }
    else{
      this.dialogRef.close(data);
    }
  }
  closeLocationModal(){
    this.dialogRef.close(this.data);
  }

  ngOnInit() {
  }

}
