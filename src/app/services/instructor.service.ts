import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { config } from '../config';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {
  instructors:any = [];
  constructor(private http: HttpClient) { 
    this.instructors = [];
    console.log("Instructor Service initialized!!!!!!!",this.instructors)
  }
  
  addInstructor(data:any): Observable<any> {
    console.log("Adding Instructors",data);
    
    return  new Observable<any>((observer)=>{
      console.log("Observable");
      var that = this;
      this.http.post(config.baseApiUrl +  "instructors",data).subscribe((res:any)=>{
      observer.next(res.data.instructor);
      observer.complete();
    })
  });
  
}
editInstructor(data:any): Observable<any> {
  console.log("Edit Instructors",data);
  return  new Observable<any>((observer)=>{
    console.log("Observable");
    this.http.put(config.baseApiUrl +  "instructors",data).subscribe((res:any)=>{
    console.log("Edited instructor : ",res);
    observer.next(res.data.instructor);
    observer.complete();
  })
});

}

deleteInstructor(id){
  return new Observable((observer)=>{
    this.http.delete(config.baseApiUrl +  "instructors?_id="+id).subscribe((res:any)=>{
    observer.next(res.data.instructors);
    observer.complete();
  })
  
})
}

getInstructors(): Observable<any>{
  console.log("Getting Instructors");
  var that = this;
  return  new Observable<any>((observer)=>{
    console.log("Observable");
    this.http.get(config.baseApiUrl +  "instructors").subscribe((res:any)=>{
    console.log("Get Instructors : ",res);
    observer.next(res.data.instructors);
    observer.complete();
  })
});

}


}
