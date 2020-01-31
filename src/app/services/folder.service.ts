import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { config } from '../config';

@Injectable({
  providedIn: 'root'
})
export class FolderService {

  constructor(private http: HttpClient) { }

  createFolder(data: any): Observable<any> {
    console.log("create Folder", data);

    let body = { title: data }

    return new Observable<any>((observer) => {
      console.log("Observable");
      var that = this;
      this.http.post(config.baseApiUrl + "folder", body).subscribe((res: any) => {

        observer.next(res.data.newFolderRes);
        // observer.complete();
      }, err => {
        console.log("ERROR ")
        observer.error(err);
      },
        () => {
          console.log("CALL COMPLETED ")
          observer.complete();
        })

    });

  }


  getFolders(): Observable<any> {
    console.log("Getting clients");
    var that = this;
    return new Observable<any>((observer) => {
      console.log("Observable");
      this.http.get(config.baseApiUrl + "folder").subscribe((res: any) => {
        console.log("Get Folders : ", res);
        observer.next(res.data.folders);
        observer.complete();
      })

    });
  }

  getFolder(id): Observable<any> {
    console.log("Getting clients");
    var that = this;
    return new Observable<any>((observer) => {
      console.log("Observable");
      this.http.get(config.baseApiUrl + "folder?_id=" + id).subscribe((res: any) => {
        console.log("Get Folders : ", res);
        observer.next(res.data.folders);
        observer.complete();
      })
    });
  }

  uploadFileToFolder(data: any): Observable<any> {
    console.log("Adding Files", data);

    return new Observable<any>((observer) => {
      console.log("Observable");
      var that = this;
      this.http.post(config.baseApiUrl + "folder/files", data).subscribe((res: any) => {
        observer.next(res.data.file);
      }, err => {
        console.log("ERROR ")
        observer.error(err);
      },
        () => {
          console.log("CALL COMPLETED ")
          observer.complete();
        })

    });
  }

  shareFolder(data: any): Observable<any> {
    console.log("Adding Files", data);

    return new Observable<any>((observer) => {
      console.log("Observable");
      var that = this;
      this.http.post(config.baseApiUrl + "folder/share", data).subscribe((res: any) => {
        observer.next(res.data.file);
      }, err => {
        console.log("ERROR ")
        observer.error(err);
      },
        () => {
          console.log("CALL COMPLETED ")
          observer.complete();
        })

    });
  }




}
