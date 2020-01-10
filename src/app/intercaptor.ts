import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs/';
import { map, catchError, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
// import 'rxjs/add/operator/do';

@Injectable()

export class AuthInterceptor implements HttpInterceptor {

    constructor(private route: ActivatedRoute,
        private router: Router, ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const accessToken = localStorage.getItem('token');
        if (accessToken) {
            const cloned = req.clone({
                headers: req.headers.set("authorization", accessToken)
            });
            return next.handle(cloned)
                .pipe(map((response: HttpResponse<any>) => {
                    return response;
                }),

                    // Cath Error 400 Bad Request
                    catchError((error: HttpErrorResponse) => {
                        const errorMessage = error.error.message;
                        if (error.status === 400) {
                            console.log('Error Occured Status 400', error);
                        } else if (error.status === 500) {
                            console.log('Error Occured Status 500', error);
                        }
                        return throwError(error.error);
                    })
                );
        } else {
            return next.handle(req)
                .pipe(
                    map((event: HttpResponse<any>) => {
                        return event;
                    }),
                    catchError((error: HttpErrorResponse) => {
                        let errorMessage = error.error.message;
                        if (error.status === 401) {
                            this.router.navigate(['/login/admin']);
                        }
                        return throwError(error);
                    })
                );
        };

    }
}