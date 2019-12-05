import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { config } from '../config';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private router: Router) { }



  login(data: any, routename, token): Observable<any> {
    data.recaptchaToken = token;
    console.log("Adding clients", data);
    console.log('Route name:', routename);

    return new Observable<any>((observer) => {
      console.log("Observable");
      var that = this;
      this.http.post(config.baseApiUrl + "" + routename + "/login", data).subscribe((res: any) => {
        localStorage.setItem('currentUser', res.data);
        localStorage.setItem('userRole', res.userRole);

        if (res.userRole == 'admin') {
          this.router.navigate(['/dashboard']);
        } else if (res.userRole == 'instructor') {
          this.router.navigate(['/dashboard']);
        } else if (res.userRole == 'client') {
          this.router.navigate(['/dashboard']);
        } else if (res.userRole == 'learner ') {
          this.router.navigate(['/dashboard']);
        }

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


}