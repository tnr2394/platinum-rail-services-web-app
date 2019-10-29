import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class SideNavServiceService {

  private sidenav: MatSidenav;
  
  constructor() { }

  public setSidenav(sidenav: MatSidenav) {
    console.log("SideNav Set in service : ",sidenav);
      this.sidenav = sidenav;
  }

  public open() {
      return this.sidenav.open();
  }


  public close() {
      return this.sidenav.close();
  }

  public toggle(): void {
      this.sidenav.toggle();
  }
}
