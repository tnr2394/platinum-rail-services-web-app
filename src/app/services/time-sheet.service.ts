import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { config } from '../config';

@Injectable({
  providedIn: 'root'
})
export class TimeSheetService {
  // http://localhost:3000/time-log
  constructor(private http: HttpClient) { }

  addTime(data: any): Observable<any> {
    console.log("Adding Time", data);
    return new Observable<any>((observer) => {
      console.log("Observable");
      var that = this;
      this.http.post(config.baseApiUrl + "time-log", data).subscribe((res: any) => {

        observer.next(res.data);
        console.log("response from service", res);

        // observer.complete();
      }, err => {
        console.log("ERROR ")
        observer.error(err);
      },
        () => {
          console.log("CALL COMPLETED response is")
          observer.complete();
        })

    });
  }

  editTime(data: any): Observable<any> {
    console.log("Editing Time", data);
    return new Observable<any>((observer) => {
      console.log("Observable");
      var that = this;
      this.http.put(config.baseApiUrl + "time-log", data).subscribe((res: any) => {
        observer.next(res.data);
        console.log("response from service", res);
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

  deleteTime(data: any): Observable<any> {
    console.log("Deleting Time", data);
    return new Observable<any>((observer) => {
      console.log("Observable");
      var that = this;
      this.http.delete(config.baseApiUrl + "time-log", data).subscribe((res: any) => {
        observer.next(res.data.timeLog);
        console.log("response from service", res);
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

  getInstructorTimeLog(id: any): Observable<any> {
    console.log("get time log", id);
    return new Observable<any>((observer) => {
      console.log("Observable");
      var that = this;
      this.http.get(config.baseApiUrl + "time-log/instructor?_id=" + id).subscribe((res: any) => {
        observer.next(res.result);
        console.log("response from service", res);
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

  getTimeLogUsingDates(data: any): Observable<any> {
    const obj = { date: data }
    console.log("get time log", obj);
    return new Observable<any>((observer) => {
      console.log("Observable");
      var that = this;
      this.http.post(config.baseApiUrl + "time-log/ins", obj).subscribe((res: any) => {
        observer.next(res.response);
        console.log("response from service", res);
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
