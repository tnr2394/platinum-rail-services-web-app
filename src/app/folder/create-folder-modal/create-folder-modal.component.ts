import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FolderService } from '../../services/folder.service';

@Component({
  selector: 'app-create-folder-modal',
  templateUrl: './create-folder-modal.component.html',
  styleUrls: ['./create-folder-modal.component.scss']
})
export class CreateFolderModalComponent implements OnInit {

  folderName = '';
  data;

  constructor(public _folderService: FolderService, public dialogRef: MatDialogRef<CreateFolderModalComponent>) { }

  ngOnInit() {
  }
  save() {
    console.log('FOLDER NAME IS', this.folderName);
    if (this.folderName != '') {
      this._folderService.createFolder(this.folderName).subscribe(data => {
        this.data = data;
        console.log("Create Successfully", data);
        this.dialogRef.close(data);
      }, err => {
        console.log('Error', err.msg);
        this.dialogRef.close(null);
      })
    }
    else {
      console.log("INVALID");
    }
  }

}
