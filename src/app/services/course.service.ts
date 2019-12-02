import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Course } from '../interfaces/course';
import { config } from '../config';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  courses: any = [];
  constructor(private http: HttpClient) {
    this.courses = [];
    console.log("courses initialized!!!!!!!", this.courses)
  }

  addCourse(data: any): Observable<any> {
    console.log("Adding courses", data);

    return new Observable<any>((observer) => {
      console.log("Observable");
      var that = this;
      this.http.post(config.baseApiUrl + "courses", data).subscribe((res: any) => {

        observer.next(res.data.course);
        observer.complete();
      })

    });

  }
  editCourse(data: any): Observable<any> {
    console.log("Edit courses", data);
    return new Observable<any>((observer) => {
      console.log("Observable");
      this.http.put(config.baseApiUrl + "courses", data).subscribe((res: any) => {
        console.log("Edited Course : ", res);
        observer.next(res.data.course);
        observer.complete();
      })
    });

  }

  deleteCourse(id) {
    return new Observable((observer) => {
      this.http.delete(config.baseApiUrl + "courses?_id=" + id).subscribe((res: any) => {
        observer.next(res.data.courses);
        observer.complete();
      })

    })
  }

  getCourses(): Observable<any> {
    console.log("Getting courses");
    var that = this;
    return new Observable<any>((observer) => {
      console.log("Observable");
      this.http.get(config.baseApiUrl + "courses").subscribe((res: any) => {
        console.log("Get Courses : ", res);
        observer.next(res.data.courses);
        observer.complete();
      })
    });
  }
  getCourse(id): Observable<any> {
    console.log("Getting courses");
    var that = this;
    return new Observable<any>((observer) => {
      console.log("Observable");
      this.http.get(config.baseApiUrl + "courses?_id=" + id).subscribe((res: any) => {
        console.log("Get Courses : ", res);
        observer.next(res.data.courses);
        observer.complete();
      })
    });
  }



}
