import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { SideNavServiceService } from '../services/side-nav-service.service';
import { LoginService } from '../services/login.service';
import { Router, ActivatedRoute } from '@angular/router';
declare var $;


@Component({
  selector: 'app-side-nav-fixed',
  templateUrl: './side-nav-fixed.component.html',
  styleUrls: ['./side-nav-fixed.component.scss']
})
export class SideNavFixedComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
