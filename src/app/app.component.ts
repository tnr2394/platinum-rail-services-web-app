import { Component, ViewChild, ChangeDetectorRef, HostListener } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { SideNavServiceService } from './services/side-nav-service.service';
import { LoginService } from './services/login.service';
import { NavigationService } from './services/navigation.service';
import { Router, ActivatedRoute } from '@angular/router';
// import { $ } from 'protractor';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('sidenav', { static: false }) public mydsidenav: MatSidenav;
  @ViewChild('sidemenu', { static: true }) sidemenu: MatSidenav;
  isPrint: boolean;
  loading: boolean = false;
  details: any;
  fileTitle: any;
  fileId: any;
  type: any;
  @HostListener('window:beforeprint', ['$event'])
  onBeforePrint(event) {
    this.isPrint = true
    $(".main").addClass('mainPrint')
    $(".sidebar").addClass('sidebarPrint')
  }

  @HostListener('window:afterprint', ['$event'])
  onAfterPrint(event) {
    this.isPrint = false
    $(".main").removeClass('mainPrint')
    $(".sidebar").removeClass('sidebarPrint')
    // $(".sidebar").css('display', 'block');
    
  }
  reason = '';

  loggedInUser;
  currentUser;
  learnerRouteName;
  instructorRouteName;
  toolTip: any = 'expand';
  isVisible: boolean = true;
  disableTooltip;
  disabled: boolean;
  public onlineOffline: boolean = navigator.onLine;


  constructor(public routingState: NavigationService, public cd: ChangeDetectorRef, private router: Router, public route: ActivatedRoute, private sidenavService: SideNavServiceService, private _loginService: LoginService) {
    console.log("Child SideBar", this.sidemenu)
    this._loginService.userRole.subscribe(res => {
      this.loggedInUser = res;
    })


    routingState.loadRouting();


    this._loginService.userProfile.subscribe(res => {
      this.currentUser = res;
      if (this.currentUser && this.currentUser.userRole == 'learner') {
        this.learnerRouteName = '/learner/' + this.currentUser._id;
        console.log(' this.currentUser', this.learnerRouteName);
      }

      if (this.currentUser && this.currentUser.userRole == 'instructor') {
        this.instructorRouteName = '/instructors/' + this.currentUser._id;
        console.log(' this.currentUser', this.instructorRouteName);
      }
    })
  }

  ngOnInit(): void {

    console.log('onlineOffline:::::::::::', this.onlineOffline);


    $('.collapseToggle').on('click', function () {
      $(".sidebar").toggleClass('sidebar--Collapse');
      $('.main').toggleClass('menu--open');
      $('body').toggleClass('overflow_hidden');
      $('#toggleIcon').toggleClass('rotate');
      $(".sidebar").hasClass('sidebar--Collapse') ? $(".tooltip-class").css({ 'display': 'block' }) : $(".tooltip-class").css({ 'display': 'none' });
      $('.sidebar ul li a').click(function () {
        var windowWidth = $(window).width();
        if (windowWidth < 1025) {
          $(".sidebar").addClass('sidebar--Collapse');
          $('.main').removeClass('menu--open');
          $('body').removeClass('overflow_hidden');
          $('#toggleIcon').addClass('rotate');
        }
      });
    });
    this.sidenavService.setSidenav(this.sidemenu);

    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.loggedInUser = localStorage.getItem("token");

    console.log(' this.currentUser', this.currentUser);

    if (this.currentUser && this.currentUser.userRole == 'learner') {
      this.learnerRouteName = '/learner/' + this.currentUser._id;
      console.log(' this.currentUser', this.learnerRouteName);
    }
    if (this.currentUser && this.currentUser.userRole == 'instructor') {
      this.instructorRouteName = '/instructors/' + this.currentUser._id;
      console.log(' this.currentUser', this.instructorRouteName);
    }
  }

  getToolTipEvent() {
    return $(".sidebar").hasClass('sidebar--Collapse');
  }

  getToolTip() {
    if ($(".sidebar").hasClass('sidebar--Collapse')) {
      this.disabled = true;
    }
    else {
      this.disabled = false;
    }
    return $(".sidebar").hasClass('sidebar--Collapse') ? 'expand' : 'collapse';
  }

  close(reason: string) {
    this.sidemenu.close();
  }

  Logout() {
    console.log('Logout is called');
    this.loading = true
    this._loginService.logout();
    this.loading = false
  }
  openFileDetails(event) {
    console.log("IN app component", event);
    // if (event.file != undefined) {
    //   this.details = event.file;
    //   this.fileTitle = this.details.alias ? this.details.alias : this.details.title
    //   this.fileId = this.details._id
    //   this.type = event.file.type
    // }
    // else {
    //   this.details = event
    //   this.fileTitle = this.details.alias ? this.details.alias : this.details.title
    //   this.fileId = this.details._id
    //   this.type = event.type
    // }
    this.mydsidenav.open()
  }
 public onActivate(event:any) {
   console.log("ACTIVE COMPONENT", event);
   this.mydsidenav.close()
   if (event.openFilesSideNav){
     console.log("openFilesSideNav called");
     event.openFilesSideNav.subscribe(res => {
       console.log("openFilesSideNav", res);
       if (res.event.file != undefined) {
         this.details = res.event.file;
         this.fileTitle = this.details.alias ? this.details.alias : this.details.title
         this.fileId = this.details._id
         this.type = res.event.file.type
       }
       else if (res.event.event && res.event.event.file) {
         this.details = res.event.event.file
         this.fileTitle = this.details.alias ? this.details.alias : this.details.title
         this.fileId = this.details._id
         this.type = res.event.event.file.type
       }
       else {
         this.details = res.event
         this.fileTitle = this.details.alias ? this.details.alias : this.details.title
         this.fileId = this.details._id
         this.type = res.event.type
       }
       this.mydsidenav.open()
     })
   }
   
    // });
  }
  closeSidnav() {
    this.mydsidenav.close()
    // this.removeCssClass = true;
    $('.parent_row').removeClass('col-width-class');
  }
}
