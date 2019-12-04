import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JobsComponent } from './jobs/jobs.component';
import { JobComponent } from './jobs/job/job.component';
import { InstructorsComponent } from './instructors/instructors.component';
import { CoursesComponent } from './courses/courses.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { ClientsComponent } from './clients/clients.component';
import { SingleClientComponent } from './clients/single-client/single-client.component';
import { LearnersComponent } from './learners/learners.component';
import { SingleLearnerComponent } from './learners/single-learner/single-learner.component';
import { MaterialsComponent } from './courses/materials/materials.component';
import { LoginComponent } from './login/login.component';



const routes: Routes = [
	{
		path: '', pathMatch: "full", redirectTo: "login/admin"
	},
	{ path: 'dashboard', component: DashboardComponent },
	{ path: 'jobs', component: JobsComponent },
	{ path: 'instructors', component: InstructorsComponent },
	{ path: 'clients', component: ClientsComponent },
	{ path: 'clients/:id', component: SingleClientComponent },
	{ path: 'courses', component: CoursesComponent },
	{ path: 'scheduler', component: SchedulerComponent },
	{ path: 'learners/:jobid', component: LearnersComponent },
	{ path: 'jobs/:jobid', component: JobComponent },
	{ path: 'learner/:id', component: SingleLearnerComponent },
	{ path: 'materials/:courseId', component: MaterialsComponent },
	{ path: 'login/:user', component: LoginComponent }
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }
