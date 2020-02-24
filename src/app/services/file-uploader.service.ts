import * as _ from 'lodash';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, Output } from '@angular/core';

import { BehaviorSubject, Subscription } from 'rxjs';
import { HttpEventType } from '@angular/common/http';

import { FolderService } from './folder.service'
import { config } from '../config';

export enum FileQueueStatus {
  Pending,
  Success,
  Error,
  Progress
}

export class FileQueueObject {
  public file: any;
  public status: FileQueueStatus = FileQueueStatus.Pending;
  public progress: number = 0;
  public request: Subscription = null;
  public response: HttpResponse<any> | HttpErrorResponse = null;

  constructor(file: any) {
    this.file = file;
  }

  // actions
  public upload = () => { /* set in service */ };
  public cancel = () => { /* set in service */ };
  public remove = () => { /* set in service */ };

  // statuses
  public isPending = () => this.status === FileQueueStatus.Pending;
  public isSuccess = () => this.status === FileQueueStatus.Success;
  public isError = () => this.status === FileQueueStatus.Error;
  public inProgress = () => this.status === FileQueueStatus.Progress;
  public isUploadable = () => this.status === FileQueueStatus.Pending || this.status === FileQueueStatus.Error;

}


@Injectable({
  providedIn: 'root'
})
export class FileUploaderService {

  public bodyData;


  public url: string;

  private _queue: BehaviorSubject<FileQueueObject[]>;
  private _files: FileQueueObject[] = [];
  private _data: any;

  constructor(private http: HttpClient, public _folderService: FolderService) {
    this._queue = <BehaviorSubject<FileQueueObject[]>>new BehaviorSubject(this._files);
  }

  // the queue
  public get queue() {
    return this._queue.asObservable();
  }

  // public events
  public onCompleteItem(queueObj: FileQueueObject, response: any, status:any): any {
    return { queueObj, response, status };
  }

  // public functions
  public addToQueue(data: any) {
    // add file to the queue
    _.each(data, (file: any) => this._addToQueue(file));
  }

  public setData(data: any) {
    console.log('Set Data In Service field::::', data);
    this.bodyData = data;
  }

  public clearQueue() {
    // clear the queue
    this._files = [];
    this._queue.next(this._files);
  }

  public uploadAll() {
    console.log("on uploadAll() the queue is", this._files);
    // upload all except already successfull or in progress
    _.each(this._files, (queueObj: FileQueueObject) => {
      if (queueObj.isUploadable()) {
        this._upload(queueObj);
      }
    });
  }

  // private functions
  private _addToQueue(file: any) {
    const queueObj = new FileQueueObject(file);

    // set the individual object events
    queueObj.upload = () => this._upload(queueObj);
    queueObj.remove = () => this._removeFromQueue(queueObj);
    queueObj.cancel = () => this._cancel(queueObj);

    // push to the queue
    this._files.push(queueObj);
    this._queue.next(this._files);
  }

  private _removeFromQueue(queueObj: FileQueueObject) {
    console.log("File removed so the queue is", this._files);
    _.remove(this._files, queueObj);
  }

  private _upload(queueObj: FileQueueObject) {

    console.log('Data::::::::::', this.bodyData)

    const formData = new FormData();


    // If Folder File
    if (this.bodyData.folderId) {
      formData.set('folderId', this.bodyData.folderId);
      this.url = config.baseApiUrl + "folder/files"
    } else if (this.bodyData.allotmentId) {
      formData.set('allotmentId', this.bodyData.allotmentId);
      formData.set('status', this.bodyData.status);
      this.url = config.baseApiUrl + "learners/submission"
    } else {
      formData.set('materialId', this.bodyData.materialId);
      this.url = config.baseApiUrl + "materials/files"
    }


    // create form data for file

    formData.append('file', queueObj.file, queueObj.file.name);

    // upload file and report progress
    const req = new HttpRequest('POST', this.url, formData, {
      reportProgress: true,
    });

    // upload file and report progress
    queueObj.request = this.http.request(req).subscribe(
      (event: any) => {

        console.log('event::::::::::::::::::::::::', event);
        if (event.type === HttpEventType.UploadProgress) {
          this._uploadProgress(queueObj, event);
        } else if (event instanceof HttpResponse) {
          this._uploadComplete(queueObj, event);
        }
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          this._uploadFailed(queueObj, err);
        } else {
          // The backend returned an unsuccessful response code.
          this._uploadFailed(queueObj, err);
        }
      }
    );

    return queueObj;
  }

  private _cancel(queueObj: FileQueueObject) {
    // update the FileQueueObject as cancelled
    queueObj.request.unsubscribe();
    queueObj.progress = 0;
    queueObj.status = FileQueueStatus.Pending;
    this._queue.next(this._files);
  }

  private _uploadProgress(queueObj: FileQueueObject, event: any) {
    // update the FileQueueObject with the current progress
    const progress = Math.round(100 * event.loaded / event.total);
    queueObj.progress = progress;
    queueObj.status = FileQueueStatus.Progress;
    this._queue.next(this._files);
  }

  private _uploadComplete(queueObj: FileQueueObject, response: HttpResponse<any>) {
    // update the FileQueueObject as completed
    queueObj.progress = 100;
    queueObj.status = FileQueueStatus.Success;
    queueObj.response = response;
    this._queue.next(this._files);
    console.log("_uploadComplete", this._queue.value.length);
    if (this._queue.next(this._files) == undefined) this.onCompleteItem(queueObj, response.body, 'finished')
    else this.onCompleteItem(queueObj, response.body, 'inprogress')
  }

  private _uploadFailed(queueObj: FileQueueObject, response: HttpErrorResponse) {
    // update the FileQueueObject as errored
    queueObj.progress = 0;
    queueObj.status = FileQueueStatus.Error;
    queueObj.response = response;
    this._queue.next(this._files);
  }

}







