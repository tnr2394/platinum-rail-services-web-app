import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
// import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FileUploadModule } from 'ng2-file-upload';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { DatePipe } from '@angular/common';
import { SearchPipe } from './search.pipe';


// Calendar
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';


import { AppComponent } from './app.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app.routing.module';

import { MatBadgeModule, MatTooltipModule, MatSelectModule, MatDialogModule, MatSidenavModule, MatButtonModule, MatCheckboxModule, MatPaginatorModule, MatToolbarModule, MatInputModule, MatProgressSpinnerModule, MatCardModule, MatMenuModule, MatIconModule, MatDatepickerModule, MatNativeDateModule, MAT_DATE_LOCALE, MatGridListModule, MatTableModule, MatSortModule, MAT_DATE_FORMATS, MatChipsModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JobsComponent } from './jobs/jobs.component';
import { InstructorsComponent } from './instructors/instructors.component';
import { CoursesComponent } from './courses/courses.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { SideNavServiceService } from './services/side-nav-service.service';
import { CdkTableModule } from '@angular/cdk/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MomentModule } from 'ngx-moment';
import { ColorPickerModule } from 'ngx-color-picker';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MatExpansionModule } from '@angular/material/expansion';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { MatTabsModule } from '@angular/material/tabs';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ChartsModule } from 'ng2-charts';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { Select2Module } from 'ng2-select2';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { MatTreeModule } from '@angular/material/tree';



// import { TagInputModule } from 'ngx-chips';

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
import { SubmissionComponent } from './submission/submission.component';
import { InstructorSubmissionComponent } from './submission/instructor-submission/instructor-submission.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AssignmentStatusComponent } from './clients/assignment-status/assignment-status.component';
import { LearnerAllotmentTileComponent } from './learners/learner-allotment-tile/learner-allotment-tile.component';
import { DragDropDirective } from './drag-drop.directive';
import { LearnerDashboardComponent } from './learners/learner-dashboard/learner-dashboard.component';
import { LearnerReadingMaterialComponent } from './learners/learner-reading-material/learner-reading-material.component';
import { AuthGuard } from './auth.guard';
import { SingleInstructorComponent } from './instructors/single-instructor/single-instructor.component';
import { AppPasswordDirective } from './app-password.directive';
import { ClientDashboardComponent } from './clients/client-dashboard/client-dashboard.component';
import { MyDocumentsComponent } from './my-documents/my-documents.component';
import { FolderComponent } from './folder/folder.component';
import { CreateFolderModalComponent } from './folder/create-folder-modal/create-folder-modal.component';
import { SingleFolderComponent } from './folder/single-folder/single-folder.component';
import { ShareFileModalComponent } from './folder/share-file-modal/share-file-modal.component';
import { ContextMenuModule } from 'ngx-contextmenu';
import { DeleteConfirmModalComponent } from './commons/delete-confirm-modal/delete-confirm-modal.component';
import { ProfileComponent } from './commons/profile/profile.component';
import { SideNavFixedComponent } from './side-nav-fixed/side-nav-fixed.component';
import { ExamsResultsComponent } from './learners/exams-results/exams-results.component';
import { FileDetailsComponent } from './commons/file-details/file-details.component';
import { MaterialElevationDirective } from './commons/material-tile/material-elevation.directive';
import { NewFileModalComponent } from './files/new-file-modal/new-file-modal.component'
import { TimeSheetComponent } from './time-sheet/time-sheet.component';
import { TimePickerComponent } from './commons/time-picker/time-picker.component';
import { AddTimelogModalComponent } from './time-sheet/add-timelog-modal/add-timelog-modal.component';
import { TimeSheetSummaryComponent } from './time-sheet/time-sheet-summary/time-sheet-summary.component';
import { WeekListComponent } from './time-sheet/week-list/week-list.component';
import { SingleWeekComponent } from './time-sheet/single-week/single-week.component';
import { AdminTimeSheetComponent } from './time-sheet/admin-time-sheet/admin-time-sheet.component';
import { InstructorConfirmationModalComponent } from './time-sheet/admin-time-sheet/instructor-confirmation-modal/instructor-confirmation-modal.component';
import { AdminReportAComponent } from './time-sheet/admin-report-a/admin-report-a.component';
import { AdminReportBComponent } from './time-sheet/admin-report-b/admin-report-b.component';
import { SafePipe } from './safe.pipe';
import { AllotmentConfirmationComponent } from './clients/assignment-status/allotment-confirmation/allotment-confirmation.component';
import { CompetencesComponent } from './instructors/competences/competences.component';
import { AddCompModalComponent } from './instructors/competences/add-comp-modal/add-comp-modal.component';
import { EditCompModalComponent } from './instructors/competences/edit-comp-modal/edit-comp-modal.component';
import { InductionPackFormComponent } from './induction-pack-form/induction-pack-form.component';

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
    SubmissionComponent,
    InstructorSubmissionComponent,
    ForgotpasswordComponent,
    ResetPasswordComponent,
    AssignmentStatusComponent,
    LearnerAllotmentTileComponent,
    DragDropDirective,
    LearnerDashboardComponent,
    LearnerReadingMaterialComponent,
    SingleInstructorComponent,
    AppPasswordDirective,
    ClientDashboardComponent,
    SearchPipe,
    MyDocumentsComponent,
    FolderComponent,
    CreateFolderModalComponent,
    SingleFolderComponent,
    ShareFileModalComponent,
    DeleteConfirmModalComponent,
    ProfileComponent,
    SideNavFixedComponent,
    ExamsResultsComponent,
    FileDetailsComponent,
    MaterialElevationDirective,
    NewFileModalComponent,
    TimeSheetComponent,
    TimePickerComponent,
    AddTimelogModalComponent,
    TimeSheetSummaryComponent,
    WeekListComponent,
    SingleWeekComponent,
    AdminTimeSheetComponent,
    InstructorConfirmationModalComponent,
    AdminReportAComponent,
    AdminReportBComponent,
    SafePipe,
    AllotmentConfirmationComponent,
    CompetencesComponent,
    AddCompModalComponent,
    EditCompModalComponent,
    InductionPackFormComponent
  ],
  imports: [
    MatTreeModule,
    NgSelectModule,
    NgxDaterangepickerMd.forRoot(),
    ChartsModule,
    Select2Module,
    NgxMaterialTimepickerModule,
    DragDropModule,
    BrowserModule,
    BrowserAnimationsModule,
    MDBBootstrapModule.forRoot(),
    MatListModule,
    MatPaginatorModule,
    MatTabsModule,
    MatSelectModule, MatButtonModule, MatCheckboxModule, MatToolbarModule, MatInputModule, MatProgressSpinnerModule, MatCardModule, MatMenuModule, MatIconModule, MatDatepickerModule, MatNativeDateModule, MatGridListModule, MatChipsModule,
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
    MatRadioModule,
    ColorPickerModule,
    MatExpansionModule,
    ImageCropperModule,
    FileUploadModule,
    RecaptchaV3Module,
    MatBadgeModule,
    FilterPipeModule,
    ContextMenuModule.forRoot({
      useBootstrap4: true,
    }),
    NgCircleProgressModule.forRoot({})
  ],
  entryComponents: [AddCourseModalComponent, EditCourseModalComponent, AddJobModalComponent, EditJobModalComponent, AddInstructorModalComponent, EditInstructorModalComponent, AddClientModalComponent, EditClientModalComponent, AddLearnerModalComponent, EditLearnerModalComponent, AddMaterialModalComponent, EditMaterialModalComponent, AddFileModalComponent, EditFileModalComponent, AllocateLearnerModalComponent, AddLocationComponent, CreateFolderModalComponent, ShareFileModalComponent, SchedulerComponent, DeleteConfirmModalComponent, AddTimelogModalComponent, InstructorConfirmationModalComponent, AllotmentConfirmationComponent, AddCompModalComponent, EditCompModalComponent],
  providers: [SideNavServiceService, DatePipe, MatDatepickerModule, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  },
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: '6LcLOcYUAAAAAHo-l4hLSePmVP_U4vNj7VlUlU1A' },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    AuthGuard
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})



export class AppModule {
}
