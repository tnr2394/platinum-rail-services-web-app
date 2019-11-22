import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  jobs = [];
  constructor(private http: HttpClient) {
    this.jobs = [];
    console.log('Jobs initialized!!', this.jobs);
   }

   addJob(data:any): Observable<any>{
      console.log('Adding Jobs', data);

      return new Observable<any>((observer)=>{
        var that = this;
        this.http.post("http://localhost:3000/jobs", data).subscribe((res:any)=>{
        observer.next(res.data.job);
        },err=>{
          console.log("ERROR");
            observer.error(err);
        },
        ()=>{
          console.log("CALL COMPLETED ");
          observer.complete();
        });
      });
   }

   editJobs(data:any, id){
     console.log("Edit jobs------", data, id);
     Object.assign(data, {_id:id})
     return new Observable<any>((observer) => {
       console.log("Observable");
       this.http.put("http://localhost:3000/jobs", data).subscribe((res: any) => {
         console.log("Edited job : ", res);
         observer.next(res.data.job);
         observer.complete();
       })
     });

   }

   deleteJobs(id){
     return new Observable((observer) => {
       this.http.delete("http://localhost:3000/jobs?_id=" + id).subscribe((res: any) => {
         observer.next(res.data.jobs);
         observer.complete();
       })
      })
   }

    getJobs():Observable<any>{
     console.log("Getting jobs");
     var that = this;
     return new Observable<any>((observer) => {
       console.log("Observable");
       this.http.get("http://localhost:3000/jobs").subscribe((res: any) => {
         console.log("Get Jobs... : ", res);
         observer.next(res.data);
         observer.complete();
       })
     });
   }
   getJobById(jobId):Observable<any>{
    console.log("Getting jobs");
    var that = this;
    return new Observable<any>((observer) => {
      console.log("Observable");
      this.http.get("http://localhost:3000/jobs?_id="+jobId).subscribe((res: any) => {
        console.log("Get Jobs... : ", res);
        observer.next(res.data);
        observer.complete();
      })
    });
  }
}
