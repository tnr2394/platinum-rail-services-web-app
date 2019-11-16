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
    console.log('Jobs initialized!!', this.jobs)
   }

   addJob(data:any): Observable<any>{
      console.log('Adding Jobs', data);

      return new Observable<any>((observer)=>{
        var that = this;
        this.http.post("http://localhost:3000/jobs", data).subscribe((res:any)=>{
        observer.next(res.data.job);
        },err=>{
          console.log("ERROR")
            observer.error(err);
        },
        ()=>{
          console.log("CALL COMPLETED ")
          observer.complete();
        })
      })
   }
}
