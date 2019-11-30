import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FileUploadModule } from 'ng2-file-upload';



// Calendar
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';


import { AppComponent } from './app.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app.routing.module';

import { MatTooltipModule, MatSelectModule, MatDialogModule, MatSidenavModule, MatButtonModule, MatCheckboxModule, MatPaginatorModule, MatToolbarModule, MatInputModule, MatProgressSpinnerModule, MatCardModule, MatMenuModule, MatIconModule, MatDatepickerModule, MatNativeDateModule, MAT_DATE_LOCALE, MatGridListModule, MatTableModule, MatSortModule, MAT_DATE_FORMATS } from '@angular/material';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JobsComponent } from './jobs/jobs.component';
import { InstructorsComponent } from './instructors/instructors.component';
import { CoursesComponent } from './courses/courses.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { MatListModule } from '@angular/material/list';
import { SideNavServiceService } from './services/side-nav-service.service';
import { CdkTableModule } from '@angular/cdk/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MomentModule } from 'ngx-moment';
import { ColorPickerModule } from 'ngx-color-picker';

import { AddCourseModalComponent } from './courses/add-course-modal/add-course-modal.component';
import { EditCourseModalComponent } from './courses/edit-course-modal/edit-course-modal.component';
import { AddJobModalComponent } from './jobs/add-job-modal/add-job-modal.component';
import { EditJobModalComponent } from './jobs/edit-job-modal/edit-job-modal.component';
import { AddInstructorModalComponent } from './instructors/add-instructor-modal/add-instructor-modal.component';
import { EditInstructorModalComponent } from './instructors/edit-instructor-modal/edit-instructor-modal.component';
import { ClientsComponent } from './clients/clients.component';
import { AddClientModalComponent } from './clients/add-client-modal/add-client-modal.component';
import { EditClientModalComponent } from './clients/edit-client-modal/edit-client-modal.component';
import { SingleClientComponent } from './clients/single-client/single-client.component';
import { LocationTabComponent } from './commons/location-tab/location-tab.component';
import { AddLocationComponent } from './clients/single-client/add-location/add-location.component';
import { JobDatesComponent } from './jobs/job-dates/job-dates.component';
import { AddLearnerModalComponent } from './learners/add-learner-modal/add-learner-modal.component';
import { EditLearnerModalComponent } from './learners/edit-learner-modal/edit-learner-modal.component';
import { AddMaterialModalComponent } from './courses/materials/add-material-modal/add-material-modal.component';
import { EditMaterialModalComponent } from './courses/materials/edit-material-modal/edit-material-modal.component';
import { LearnersComponent } from './learners/learners.component';
import { JobComponent } from './jobs/job/job.component';
import { SingleLearnerComponent } from './learners/single-learner/single-learner.component';
import { MaterialsComponent } from './courses/materials/materials.component';
import { MaterialTileComponent } from './commons/material-tile/material-tile.component';
import { FileTileComponent } from './commons/file-tile/file-tile.component';
import { FilesComponent } from './files/files.component';
import { AddFileModalComponent } from './files/add-file-modal/add-file-modal.component';
import { EditFileModalComponent } from './files/edit-file-modal/edit-file-modal.component';
import { LearnerSubmissionComponent } from './learners/learner-submission/learner-submission.component';
import { MaterialComponent } from './courses/materials/material/material.component';
import { AllocateLearnerModalComponent } from './jobs/job/allocate-learner-modal/allocate-learner-modal.component';
import { LoginComponent } from './login/login.component';
import { AuthInterceptor } from './intercaptor';

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
    AddInstructorModalComponent,
    EditInstructorModalComponent,
    ClientsComponent,
    AddClientModalComponent,
    EditClientModalComponent,
    SingleClientComponent,
    LocationTabComponent,
    AddLocationComponent,
    JobDatesComponent,
    LearnersComponent,
    JobComponent,
    SingleLearnerComponent,
    MaterialsComponent,
    AddLearnerModalComponent,
    EditLearnerModalComponent,
    SingleLearnerComponent,
    MaterialsComponent,
    MaterialTileComponent,
    EditLearnerModalComponent,
    AddMaterialModalComponent,
    EditMaterialModalComponent,
    FileTileComponent,
    FilesComponent,
    AddFileModalComponent,
    EditFileModalComponent,
    LearnerSubmissionComponent,
    MaterialComponent,
    AllocateLearnerModalComponent,
    LoginComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MDBBootstrapModule.forRoot(),
    MatListModule,
    MatPaginatorModule,
    MatSelectModule, MatButtonModule, MatCheckboxModule, MatToolbarModule, MatInputModule, MatProgressSpinnerModule, MatCardModule, MatMenuModule, MatIconModule, MatDatepickerModule, MatNativeDateModule, MatGridListModule,
    MatSidenavModule, MatTooltipModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MomentModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    FlatpickrModule.forRoot(),
    MatDialogModule,
    NgbModule,
    MatTableModule,
    MatSortModule,
    CdkTableModule,
    MatSnackBarModule,
    ColorPickerModule,
    FileUploadModule
  ],
  entryComponents: [AddCourseModalComponent, EditCourseModalComponent, AddJobModalComponent, EditJobModalComponent, AddInstructorModalComponent, EditInstructorModalComponent, AddClientModalComponent, EditClientModalComponent, AddLearnerModalComponent, EditLearnerModalComponent, AddMaterialModalComponent, EditMaterialModalComponent, AddFileModalComponent, EditFileModalComponent, AllocateLearnerModalComponent],
  providers: [SideNavServiceService, MatDatepickerModule, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],

  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})



export class AppModule {
}
