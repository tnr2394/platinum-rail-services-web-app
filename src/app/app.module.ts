import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';


// Calendar
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';


import { AppComponent } from './app.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app.routing.module';
import { MatSelectModule, MatDialogModule, MatSidenavModule, MatButtonModule, MatCheckboxModule, MatPaginatorModule, MatToolbarModule, MatInputModule, MatProgressSpinnerModule, MatCardModule, MatMenuModule, MatIconModule, MatDatepickerModule, MatNativeDateModule} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JobsComponent } from './jobs/jobs.component';
import { InstructorsComponent } from './instructors/instructors.component';
import { CoursesComponent } from './courses/courses.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { MatListModule } from '@angular/material/list';
import { SideNavServiceService } from './services/side-nav-service.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AddCourseModalComponent } from './courses/add-course-modal/add-course-modal.component';
import { EditCourseModalComponent } from './courses/edit-course-modal/edit-course-modal.component';
import { AddJobModalComponent } from './jobs/add-job-modal/add-job-modal.component';
import { EditJobModalComponent } from './jobs/edit-job-modal/edit-job-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    TopNavComponent,
    DashboardComponent,
    CoursesComponent,
    JobsComponent,
    InstructorsComponent,
    SchedulerComponent,
    AddCourseModalComponent,
    EditCourseModalComponent,
    AddJobModalComponent,
    EditJobModalComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MDBBootstrapModule.forRoot(),
    MatListModule,
    MatPaginatorModule,
    MatSelectModule, MatButtonModule, MatCheckboxModule, MatToolbarModule, MatInputModule, MatProgressSpinnerModule, MatCardModule, MatMenuModule, MatIconModule, MatDatepickerModule, MatNativeDateModule,
    MatSidenavModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    FlatpickrModule.forRoot(),
    MatDialogModule,
    NgbModule,
  ],
  entryComponents:[AddCourseModalComponent, EditCourseModalComponent,AddJobModalComponent],
  providers: [SideNavServiceService, MatDatepickerModule],
  bootstrap: [AppComponent]
})



export class AppModule { 
}
