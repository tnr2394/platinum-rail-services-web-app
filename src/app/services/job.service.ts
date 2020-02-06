import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { config } from '../config';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  jobs = [];
  constructor(private http: HttpClient) {
    this.jobs = [];
    console.log('Jobs initialized!!', this.jobs);
  }

  addJob(data: any): Observable<any> {
    console.log('Adding Jobs', data);

    return new Observable<any>((observer) => {
      var that = this;
      this.http.post(config.baseApiUrl + "jobs", data).subscribe((res: any) => {
        observer.next(res.data.job);
      }, err => {
        console.log("ERROR");
        observer.error(err);
      },
        () => {
          console.log("CALL COMPLETED ");
          observer.complete();
        });
    });
  }

  editJobs(data: any, id) {
    console.log("Edit jobs------", data, id);
    Object.assign(data, { _id: id })
    return new Observable<any>((observer) => {
      console.log("Observable");
      this.http.put(config.baseApiUrl + "jobs", data).subscribe((res: any) => {
        console.log("Edited job : ", res);
        observer.next(res.data.job);
        observer.complete();
      })
    });

  }

  deleteJobs(id) {
    return new Observable((observer) => {
      this.http.delete(config.baseApiUrl + "jobs?_id=" + id).subscribe((res: any) => {
        observer.next(res.data.jobs);
        observer.complete();
      })
    })
  }

  getJobs(): Observable<any> {
    console.log("Getting jobs");
    var that = this;
    return new Observable<any>((observer) => {
      console.log("Observable");
      this.http.get(config.baseApiUrl + "jobs").subscribe((res: any) => {
        console.log("Get Jobs... :11111111 ", res);
        observer.next(res.data);
        observer.complete();
      })
    });
  }
  getJobById(jobId): Observable<any> {
    console.log("Getting jobs", jobId);
    var that = this;
    return new Observable<any>((observer) => {
      console.log("Observable");
      this.http.get(config.baseApiUrl + "jobs?_id=" + jobId).subscribe((res: any) => {
        console.log("Get Jobs... : ", res);
        observer.next(res.data);
        observer.complete();
      })
    });
  }
  getJobByInstructorId(instructorId): Observable<any> {
    console.log("Getting jobs");
    var that = this;
    return new Observable<any>((observer) => {
      console.log("Observable");
      this.http.get(config.baseApiUrl + "jobs/instructor?_id=" + instructorId).subscribe((res: any) => {
        console.log("Get Jobs... : ", res);
        observer.next(res.data);
        observer.complete();
      })
    });
  }
  getJobByClientId(clientId): Observable<any> {
    console.log("Getting jobs");
    var that = this;
    return new Observable<any>((observer) => {
      console.log("Observable");
      this.http.get(config.baseApiUrl + "jobs/client?_id=" + clientId).subscribe((res: any) => {
        console.log("Get Jobs... : ", res);
        observer.next(res.data);
        observer.complete();
      })
    });
  }
}
