import { Injectable } from '@angular/core';
import { Observable, observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { config } from '../config';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { map } from 'rxjs/operators';





@Injectable({
  providedIn: 'root'
})
export class LoginService {

  @Output() userRole: EventEmitter<any> = new EventEmitter<any>();
  @Output() userProfile: EventEmitter<any> = new EventEmitter<any>();
  @Output() userToken: EventEmitter<any> = new EventEmitter<any>();

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;


  constructor(private http: HttpClient, private router: Router) {

    console.log('localStorage', localStorage.getItem('currentUser'));
    if (localStorage.getItem('currentUser') != null) {
      console.log('Inside IF-----------');
      this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
    } else {
      this.currentUserSubject = new BehaviorSubject<any>(localStorage.getItem('currentUser'));
    }

    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(data: any, routename, token): Observable<any> {
    data.recaptchaToken = token;
    console.log("Adding clients", data);
    console.log('Route name:', routename);

    return new Observable<any>((observer) => {
      console.log("Observable");
      var that = this;
      this.http.post(config.baseApiUrl + "" + routename + "/login", data).subscribe((res: any) => {


        localStorage.setItem('token', res.token);
        localStorage.setItem('currentUser', JSON.stringify(res.profile));

        this.currentUserSubject.next(res.profile);


        this.userRole.emit(res.userRole);
        this.userProfile.emit(res.profile);
        this.userToken.emit(res.token);

        const learnerDashBoard = '/learner/' + res.profile._id;

        if (res.userRole == 'admin') {
          this.router.navigate(['/dashboard']);
        } else if (res.userRole == 'instructor') {
          this.router.navigate(['/scheduler']);
        } else if (res.userRole == 'client') {
          this.router.navigate(['/jobs']);
        } else if (res.userRole == 'learner') {
          this.router.navigate([learnerDashBoard]);
        }

        observer.next(res.data);
        observer.complete();
        return res.profile;
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
  logout() {

    console.log('Logout is called');
    localStorage.clear();
    this.router.navigate(['/login/admin']);
    setTimeout(function () { window.location.reload() }, 1);
    this.currentUserSubject.next(null);

  }


  forgotPassword(data: any, routename): Observable<any> {
    console.log("forgotpassword", data);
    return new Observable<any>((observer) => {
      console.log("Observable");
      var that = this;
      this.http.post(config.baseApiUrl + "" + data.user + "/forgot-password", data).subscribe((res: any) => {
        observer.next(res.data);
        // observer.complete();
      }, err => {
        console.log("ERROR ")
        observer.error(err);
      }, () => {
        console.log("CALL COMPLETED ")
        observer.complete();
      })
    });
  }

  resetPassword(data: any, routename): Observable<any> {
    console.log("reset password", data, routename);
    return new Observable<any>((observer) => {
      console.log("Observable");
      var that = this;
      this.http.post(config.baseApiUrl + "" + routename + "/reset-password", data).subscribe((res: any) => {
        observer.next(res.data);
        // observer.complete();
      }, err => {
        console.log("ERROR ", err)
        observer.error(err);
      }, () => {
        console.log("CALL COMPLETED ")
        observer.complete();
      })
    });

  }


}
