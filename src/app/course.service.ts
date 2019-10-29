import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Course } from './interfaces/course';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

constructor(private http: HttpClient) { }

  getCourses(): Observable<any>{
    console.log("Getting courses");

    return  new Observable<any>((observer)=>{
      console.log("Observable");
      setTimeout(function(){
        var obj:any = [
          {title:"L3 W14", _id:"",duration: 24},
          {title:"MH/FA", _id:"",duration: 5},
          {title:"First Aid/E-Learning", _id:"",duration: 10},
          {title:"DCCR", _id:"",duration: 16},
          {title:"ICI OLEC 1", _id:"",duration: 18},
          {title:"PTS AC", _id:"",duration: 22},
          {title:"TIC", _id:"",duration: 19},
          {title:"Meet up MO", _id:"",duration: 23},
          {title:"Rail Saw", _id:"",duration: 31},
          {title:"IAG", _id:"",duration: 36},
          {title:"L3 W4", _id:"",duration: 7},
          {title:"L3 W6", _id:"",duration: 25},
          {title:"L3 W3", _id:"",duration: 12},
          {title:"ICI OLEC 2", _id:"",duration: 6}
        ];
        observer.next(obj);

      },3000)
    });

  }


}
