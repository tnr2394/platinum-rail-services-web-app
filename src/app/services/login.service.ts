import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private router: Router) { }



  login(data: any, routename): Observable<any> {
    console.log("Adding clients", data);
    console.log('Route name:', routename);

    return new Observable<any>((observer) => {
      console.log("Observable");
      var that = this;
      this.http.post("http://localhost:3000/" + routename + "/login", data).subscribe((res: any) => {
        localStorage.setItem('currentUser', res.data);
        localStorage.setItem('userRole', res.userRole);

        if (res.userRole == 'admin') {
          this.router.navigate(['dashboard']);
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
