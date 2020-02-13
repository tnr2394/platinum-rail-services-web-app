import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JobsComponent } from './jobs/jobs.component';
import { JobComponent } from './jobs/job/job.component';
import { InstructorsComponent } from './instructors/instructors.component';
import { CoursesComponent } from './courses/courses.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { ClientsComponent } from './clients/clients.component';
import { ClientDashboardComponent } from './clients/client-dashboard/client-dashboard.component';
import { SingleClientComponent } from './clients/single-client/single-client.component';
import { LearnersComponent } from './learners/learners.component';
import { SingleLearnerComponent } from './learners/single-learner/single-learner.component';
import { MaterialsComponent } from './courses/materials/materials.component';
import { LoginComponent } from './login/login.component';
import { SubmissionComponent } from './submission/submission.component';
import { InstructorSubmissionComponent } from './submission/instructor-submission/instructor-submission.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { LearnerSubmissionComponent } from './learners/learner-submission/learner-submission.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AssignmentStatusComponent } from './clients/assignment-status/assignment-status.component';
import { LearnerDashboardComponent } from './learners/learner-dashboard/learner-dashboard.component';
import { LearnerReadingMaterialComponent } from './learners/learner-reading-material/learner-reading-material.component'
import { LearnerAllotmentTileComponent } from './learners/learner-allotment-tile/learner-allotment-tile.component';
import { SingleInstructorComponent } from './instructors/single-instructor/single-instructor.component';
import { MyDocumentsComponent } from './my-documents/my-documents.component';
import { SingleFolderComponent } from './folder/single-folder/single-folder.component';
import { ProfileComponent } from './commons/profile/profile.component';
import { ExamsResultsComponent } from './learners/exams-results/exams-results.component';
import { NewFileModalComponent } from './files/new-file-modal/new-file-modal.component';
import { AuthGuard } from './auth.guard';
import { Role } from './_models/role';


const routes: Routes = [
	{
		path: '',
		pathMatch: "full",
		redirectTo: "login/admin"
	},
	{
		path: 'dashboard',
		component: DashboardComponent,
		canActivate: [AuthGuard],
		data: { roles: [Role.Admin] }
	},
	{
		path: 'jobs',
		component: JobsComponent,
		canActivate: [AuthGuard],
		data: { roles: [Role.Admin, Role.Instructor, Role.Client] }
	},
	{
		path: 'instructors',
		component: InstructorsComponent,
		canActivate: [AuthGuard],
		data: { roles: [Role.Admin] }
	},
	{
		path: 'clients',
		component: ClientsComponent,
		canActivate: [AuthGuard],
		data: { roles: [Role.Admin] }
	},
	{
		path: 'clients/:id',
		component: SingleClientComponent,
		canActivate: [AuthGuard],
	},
	{
		path: 'courses',
		component: CoursesComponent,
		canActivate: [AuthGuard],
		data: { roles: [Role.Admin] }
	},
	{
		path: 'scheduler',
		component: SchedulerComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'learners/:jobid',
		component: LearnersComponent,
		canActivate: [AuthGuard],
		data: { roles: [Role.Instructor, Role.Admin] }
	},
	{
		path: 'jobs/:jobid',
		component: JobComponent,
		canActivate: [AuthGuard],
		data: { roles: [Role.Admin, Role.Instructor, Role.Client] }
	},
	{
		path: 'learner/:id',
		component: LearnerDashboardComponent,
		canActivate: [AuthGuard],
	},
	{
		path: 'single-learner/:id',
		component: SingleLearnerComponent,
		canActivate: [AuthGuard],
	},
	{
		path: 'learnerReadingMaterial',
		component: LearnerReadingMaterialComponent,
		canActivate: [AuthGuard],
	},
	{
		path: 'learnerAllotment/:id',
		component: LearnerAllotmentTileComponent,
		canActivate: [AuthGuard],
	},
	{
		path: 'materials/:courseId',
		component: MaterialsComponent,
		canActivate: [AuthGuard],
	},
	{
		path: 'exam-result/:jobid',
		component: ExamsResultsComponent,
		canActivate: [AuthGuard],
	},
	{
		path: 'submission',
		component: SubmissionComponent,
		canActivate: [AuthGuard],
		data: { roles: [Role.Admin, Role.Instructor] }
	},
	{
		path: 'submission/learner/:id',
		component: InstructorSubmissionComponent,
		canActivate: [AuthGuard],
	},
	{
		path: 'login/:user',
		component: LoginComponent
	},
	{
		path: 'forgotpassword/:user',
		component: ForgotpasswordComponent
	},
	{
		path: 'learner/allotment/:id',
		component: LearnerSubmissionComponent,
		canActivate: [AuthGuard],
	},
	{
		path: 'resetpassword/:user',
		component: ResetPasswordComponent,
		canActivate: [AuthGuard],
	},
	{
		path: 'assignment/status/:jobid',
		component: AssignmentStatusComponent,
		canActivate: [AuthGuard],
	},
	{
		path: 'instructors/:id',
		component: SingleInstructorComponent,
		canActivate: [AuthGuard],
	},
	{
		path: 'client/:id',
		component: ClientDashboardComponent
	},
	{
		path: 'mydocuments',
		component: MyDocumentsComponent,
		canActivate: [AuthGuard],
		data: { roles: [Role.Admin, Role.Instructor, Role.Client] }
	},
	{
		path: 'single-folder/:id',
		component: SingleFolderComponent,
		canActivate: [AuthGuard],
		data: { roles: [Role.Admin, Role.Instructor, Role.Client] }
	},
	{
		path: 'profile',
		component: ProfileComponent
	},
	{
		path: 'newFile',
		component: NewFileModalComponent
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }
