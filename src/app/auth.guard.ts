import { Injectable } from '@angular/core';
import { LoginService } from '../app/services/login.service'
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
    providedIn: 'root'
})


export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: LoginService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // const currentUser = this.authenticationService.currentUserValue;

        // console.log('currentUser---------------->>>>>>>', currentUser);
        
        // if (currentUser) {
        //     // check if route is restricted by role
        //     if (route.data.roles && route.data.roles.indexOf(currentUser.userRole) === -1) {
        //         // role not authorised so redirect to home page
        //         this.router.navigate(['/dashboard']);
        //         return false;
        //     }

        //     // authorised so return true
        //     return true;
        // }

        // // not logged in so redirect to login page with the return url
        // this.router.navigate(['/login/admin'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}



