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

  constructor(public uploader: FileUploaderService, public _snackbar: MatSnackBar, public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {

    console.log("Upload files initialized", this.data);

    this.queue = this.uploader.queue;
    this.uploader.bodyData = this.data;
    this.uploader.onCompleteItem = this.completeItem;
  }

  completeItem = (item: FileQueueObject, response: any) => {
    console.log('Response:::::::::::::', response, item);
    this.data = response.data;
    // this.dialogRef.close(response.data.file);
    this.onCompleteItem.emit({ item, response });
  }

  addToQueue() {
    const fileBrowser = this.fileInput.nativeElement;
    this.uploader.addToQueue(fileBrowser.files);
    console.log("que",this.queue)
  }

  dragQueue(event) {
    this.uploader.addToQueue(event);
  }

}
