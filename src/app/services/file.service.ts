import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { config } from '../config';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  clients: any = [];
  constructor(private http: HttpClient) {
    this.clients = [];
    console.log("File Service initialized!!!!!!!", this.clients)
  }

  addFiles(data: any): Observable<any> {
    console.log("Adding Files", data);

    return new Observable<any>((observer) => {
      console.log("Observable");
      var that = this;
      this.http.post(config.baseApiUrl + "materials/files", data).subscribe((res: any) => {

        observer.next(res.data.file);
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


  deleteFiles(id) {
    return new Observable((observer) => {
      this.http.delete(config.baseApiUrl + "materials/files?_id=" + id).subscribe((res: any) => {
        observer.next(res.data.file);
        // observer.complete();
      })
    })
  }

  editClient(data: any): Observable<any> {
    console.log("Edit clients", data);
    return new Observable<any>((observer) => {
      console.log("Observable");
      this.http.put(config.baseApiUrl + "clients", data).subscribe((res: any) => {
        console.log("Edited Course : ", res);
        observer.next(res.data.client);
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

  deleteClient(id) {
    return new Observable((observer) => {
      this.http.delete(config.baseApiUrl + "clients?_id=" + id).subscribe((res: any) => {
        observer.next(res.data.clients);
        // observer.complete();
      }, err => {
        console.log("ERROR ")
        observer.error(err);
      },
        () => {
          console.log("CALL COMPLETED ")
          observer.complete();
        });

    })
  }

  deleteLocation(id) {
    return new Observable((observer) => {
      this.http.delete(config.baseApiUrl + "clients/location?_id=" + id).subscribe((res: any) => {
        observer.next(res.data.clients);
        // observer.complete();
      }, err => {
        console.log("ERROR ")
        observer.error(err);
      },
        () => {
          console.log("CALL COMPLETED ")
          observer.complete();
        });

    })
  }


  getFilesByMaterial(id): Observable<any> {
    console.log("Getting Files");
    var that = this;
    return new Observable<any>((observer) => {
      console.log("Observable");
      this.http.get(config.baseApiUrl + "materials/files?_id=" + id).subscribe((res: any) => {
        console.log("Get Files Response : ", res);
        observer.next(res.data.files);
        observer.complete();
      })

    });
  }


  addLocation(data: any): Observable<any> {
    console.log("Adding location", data);

    return new Observable<any>((observer) => {
      console.log("Observable");
      var that = this;
      this.http.post(config.baseApiUrl + "clients/location", data).subscribe((res: any) => {
        console.log("Received Sending = ", res.data.location)
        observer.next(res.data.location);
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

  updateLocation(data: any): Observable<any> {
    console.log("Adding location", data);

    return new Observable<any>((observer) => {
      console.log("Observable");
      var that = this;
      this.http.put(config.baseApiUrl + "clients/location", data).subscribe((res: any) => {
        console.log("Received Sending = ", res.data.location)
        observer.next(res.data.location);
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


}
