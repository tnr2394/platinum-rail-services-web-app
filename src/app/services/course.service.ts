import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Course } from '../interfaces/course';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
courses:any = [];
constructor(private http: HttpClient) { 
  this.courses = [
    {title:"L3 W14", _id:"1",duration: 24},
    {title:"MH/FA", _id:"2",duration: 5},
    {title:"First Aid/E-Learning", _id:"3",duration: 10},
    {title:"DCCR", _id:"4",duration: 16},
    {title:"ICI OLEC 1", _id:"5",duration: 18},
    {title:"PTS AC", _id:"6",duration: 22},
    {title:"TIC", _id:"7",duration: 19},
    {title:"Meet up MO", _id:"8",duration: 23},
    {title:"Rail Saw", _id:"9",duration: 31},
    {title:"IAG", _id:"10",duration: 36},
    {title:"L3 W4", _id:"11",duration: 7},
    {title:"L3 W6", _id:"12",duration: 25},
    {title:"L3 W3", _id:"13",duration: 12},
    {title:"ICI OLEC 2", _id:"14",duration: 6}
  ];
  console.log("courses initialized!!!!!!!",this.courses)
}

addCourse(data:any): Observable<any> {
  console.log("Adding courses",data);

  return  new Observable<any>((observer)=>{
    console.log("Observable");
    var that = this;
    this.http.post("http://localhost:3000/courses",data).subscribe((res:any)=>{

    observer.next(res.data.courses);
      observer.complete();
    })


    // setTimeout(function(){
    //   that.courses.push(data);
    //   console.log("Course added: ",data,that.courses);
    //   observer.next(that.courses);
    // });
  });

}
editCourse(data:any): Observable<any> {
  console.log("Edit courses",data);
  return  new Observable<any>((observer)=>{
    console.log("Observable");
    this.http.put("http://localhost:3000/courses",data).subscribe((res:any)=>{
      console.log("Edited Course : ",res);
      observer.next(res.data.courses);
      observer.complete();
    })
  });

}

  deleteCourse(id){
    return new Observable((observer)=>{
      this.http.delete("http://localhost:3000/courses?_id="+id).subscribe((res:any)=>{
        observer.next(res.data.courses);
        observer.complete();
      })
      
    })
  }
  
  getCourses(): Observable<any>{
    console.log("Getting courses");
    var that = this;
    return  new Observable<any>((observer)=>{
      console.log("Observable");
      this.http.get("http://localhost:3000/courses").subscribe((res:any)=>{
        console.log("Get Courses : ",res);
        observer.next(res.data.courses);
        observer.complete();
      })
  
      // setTimeout(function(){
      //   console.log("Returning ",that.courses);
      //   observer.next(that.courses);
      //   observer.complete();
      // },100)
    });

  }


}
