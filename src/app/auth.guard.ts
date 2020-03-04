import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, ActivatedRoute, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './services/login.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private activeRoute: ActivatedRoute, private router: Router, private _loginService: LoginService) {
  }
  returnUrl;
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const currentUser = this._loginService.currentUserValue;
    console.log("currentUser Admin:", currentUser);
    if (currentUser != null) {

      if (route.data.roles && route.data.roles.indexOf(currentUser.userRole) === -1) {
        // role not authorised so redirect to equivalent page

        if (currentUser.userRole == 'admin') {
          this.router.navigate(['/dashboard']);
        } else if (currentUser.userRole == 'instructor') {
          this.router.navigate(['/scheduler']);
        } else if (currentUser.userRole == 'client') {
          this.router.navigate(['/jobs']);
        } else if (currentUser.userRole == 'learner') {
          if (this.returnUrl) {
            this.router.navigate(this.returnUrl)
          } else {
            this.router.navigate(['/learner/' + currentUser._id]);
          }
        }

        return false;
      }

      return true;
    }
    console.log('state.url======>', state.url);
    const userType: string = route.queryParams.user;

    // not logged in so redirect to login page with the return url
    // this.router.navigate(['/login/admin']);

    this.router.navigate(['login/' + userType], { queryParams: { returnUrl: state.url } });
    return false;
  }

}

