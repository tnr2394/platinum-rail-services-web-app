import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

const URL = 'http://localhost:3000/folder/files';

@Component({
  selector: 'app-new-file-modal',
  templateUrl: './new-file-modal.component.html',
  styleUrls: ['./new-file-modal.component.scss']
})
export class NewFileModalComponent implements OnInit {

  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  hasAnotherDropZoneOver: boolean;
  response: string;


  constructor() {
    this.uploader = new FileUploader({
      url: URL,
      disableMultipart: true, // 'DisableMultipart' must be 'true' for formatDataFunction to be called.
      formatDataFunctionIsAsync: true,
      method: 'POST',
      formatDataFunction: async (item) => {
        return new Promise((resolve, reject) => {
          console.log("resolve", resolve)
          resolve({
            name: item._file.name,
            length: item._file.size,
            contentType: item._file.type,
            date: new Date()
          });
        });
      }
    });

    this.hasBaseDropZoneOver = false;
    this.hasAnotherDropZoneOver = false;

    this.response = '';

    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
    }

    this.uploader.response.subscribe(res => this.response = res);
  }

  ngOnInit() {
  }



  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

}
