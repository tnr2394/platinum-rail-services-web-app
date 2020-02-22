import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import { Observable, observable, BehaviorSubject } from 'rxjs';
import { resolve } from 'url';
import { reject } from 'q';
import { FileUploaderService } from './file-uploader.service';

@Injectable({
  providedIn: 'root'
})
export class S3UploadService {

  constructor() { }

  uploadFile(file, filename) {
    console.log('File and File Name', file, filename);

    const contentType = file.type;
    let re = /(?:\.([^.]+))?$/;
    let ext = re.exec(file.name)[1];
    let name = file.name.split('.').slice(0, -1).join('.')
    let newName = name + '-' + Date.now() + '.' + ext;


    const bucket = new S3(
      {
        accessKeyId: 'YOUR ACCESS',
        secretAccessKey: 'YOUR SECRET',
        region: 'ap-south-1'
      }
    );
    const params = {
      Bucket: 'testing-platinum-rail-services',
      Key: newName,
      Body: file,
      ACL: 'public-read',
      ContentType: contentType
    };
    // bucket.upload(params, function (err, data) {
    //   if (err) {
    //     console.log('There was an error uploading your file: ', err);
    //     return false;
    //   }
    //   console.log('Successfully uploaded file.', data);
    //   return true;
    // });
    //for upload progress   
    return new Observable<any>((observer) => {
      bucket.upload(params).on('httpUploadProgress', function (evt) {
        console.log('Event In evt====>>>>', evt);
        // resolve(evt)
        // console.log(evt.loaded + ' of ' + evt.total + ' Bytes');
        observer.next(evt);
      }).send(function (err, data) {
        if (err) {
          console.log('There was an error uploading your file: ', err);
          observer.error(err);
        }
        console.log('Successfully uploaded file.', data);
        observer.next(data);
      });
    })
  }
}
