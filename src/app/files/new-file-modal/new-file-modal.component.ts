import { Component, EventEmitter, OnInit, Inject, Output, ViewChild } from '@angular/core';
import { FileQueueObject, FileUploaderService } from '../../services/file-uploader.service'
import { Observable } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-new-file-modal',
  templateUrl: './new-file-modal.component.html',
  styleUrls: ['./new-file-modal.component.scss']
})
export class NewFileModalComponent implements OnInit {

  @Output() onCompleteItem = new EventEmitter();

  @ViewChild('fileInput', { static: false }) fileInput;
  queue: Observable<FileQueueObject[]>;
  uploadedFiles = [];
  uploadedFilesCount = 0
  constructor(public uploader: FileUploaderService, public _snackbar: MatSnackBar, public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {

    console.log("Upload files initialized", this.data);

    this.queue = this.uploader.queue;
    this.uploader.bodyData = this.data;
    this.uploader.onCompleteItem = this.completeItem;
    this.uploader.clearQueue()
  }

  completeItem = (item: FileQueueObject, response: any) => {
    console.log('New file uploaded', response, item);
    this.data = response.data;
    this.uploadedFilesCount++
    console.log("response.data", response.data);
    this.uploadedFiles.push(response.data.file[0])
    console.log("this.uploadedFiles", this.uploadedFiles);
    
    // this.dialogRef.close(response.data.file);
    // this.onCompleteItem.emit({ item, response });
  }

  addToQueue() {
    const fileBrowser = this.fileInput.nativeElement;
    this.uploader.addToQueue(fileBrowser.files);
    console.log("que",this.queue)
    // this.dialogRef.close(this.queue)
  }

  dragQueue(event) {
    this.uploader.addToQueue(event);
  }
  upload(){
    let close
    // let tempArray = this.uploader.uploadAll()
    // console.log("TEMP array on custom Upload", tempArray);
    // console.log("this.queue", this.queue);
    // this.dialogRef.close(tempArray)
    let temp = this.uploader.uploadAll()
      // if(tempArray){
      //   tempArray.forEach(testFile=>{
      //     console.log("file.response", testFile, testFile.file, testFile.status, testFile['response'] );
      //     console.log("file.response", JSON.stringify(testFile.response));
      //     console.log("file.response", JSON.stringify(testFile, null, 2));

      //     close = testFile.response ? true : false
      //     console.log("Close", close);
      //   })
      // }
      // if(close == true) this.dialogRef.close(tempArray)
  }
  close(){
    this.dialogRef.close(this.uploadedFiles)
  }
}
