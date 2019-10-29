import { Component, OnInit } from '@angular/core';
import { SideNavServiceService } from '../side-nav-service.service';


@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {

  constructor(public sideNavService: SideNavServiceService) { 

  }
  openMenu(){
    this.sideNavService.open();
  }

  ngOnInit() {
  }

}
