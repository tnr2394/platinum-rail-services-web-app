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

    // let body = { title: data }

    return new Observable<any>((observer) => {
      console.log("Observable");
      var that = this;
      this.http.post(config.baseApiUrl + "folder", data).subscribe((res: any) => {

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

  editFolder(data: any): Observable<any> {
    console.log("create Folder", data);
    return new Observable<any>((observer) => {
      console.log("Observable");
      var that = this;
      this.http.put(config.baseApiUrl + "folder", data).subscribe((res: any) => {

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

  deleteFolder(data: any): Observable<any> {
    console.log("create Folder", data);
    return new Observable<any>((observer) => {
      console.log("Observable");
      var that = this;
      this.http.delete(config.baseApiUrl + "folder?_id=" + data).subscribe((res: any) => {

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

  getSharedFolders(): Observable<any> {
    console.log("Getting shared folders");
    var that = this;
    return new Observable<any>((observer) => {
      console.log("Observable");
      this.http.get(config.baseApiUrl + "folder/shared").subscribe((res: any) => {
        console.log("Get Folders : ", res);
        observer.next(res.data.folders);
        observer.complete();
      })

    });
  }

  getSharedFiles(): Observable<any> {
    console.log("Getting shared files");
    var that = this;
    return new Observable<any>((observer) => {
      console.log("Observable");
      this.http.get(config.baseApiUrl + "folder/shared-file").subscribe((res: any) => {
        console.log("Get Files :::::::: ", res);
        observer.next(res.data.files);
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
        observer.next(res.data);
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
        console.log("in folder service", res);
        
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
    console.log("Sharing Folder", data);

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

  shareFile(data: any): Observable<any> {
    console.log("Sharing Files", data);
    return new Observable<any>((observer) => {
      console.log("Observable");
      var that = this;
      this.http.post(config.baseApiUrl + "folder/share-file", data).subscribe((res: any) => {
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
