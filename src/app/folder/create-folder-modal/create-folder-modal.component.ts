import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-create-folder-modal',
  templateUrl: './create-folder-modal.component.html',
  styleUrls: ['./create-folder-modal.component.scss']
})
export class CreateFolderModalComponent implements OnInit {

  folderName = '';

  constructor(public dialogRef: MatDialogRef<CreateFolderModalComponent>) { }

  ngOnInit() {
  }
  save(){
    console.log('FOLDER NAME IS', this.folderName);
    if(this.folderName != ''){
      this.dialogRef.close(this.folderName);
    }
    else{
      console.log("INVALID");
    }
  }

}
