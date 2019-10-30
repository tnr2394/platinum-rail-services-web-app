import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JobsComponent } from './jobs/jobs.component';
import { InstructorsComponent } from './instructors/instructors.component';
import { CoursesComponent } from './courses/courses.component';
import { SchedulerComponent } from './scheduler/scheduler.component';

const routes: Routes = [
	{ path: 'dashboard', component: DashboardComponent },
    { path: 'jobs',      component: JobsComponent },
    { path: 'instructors',      component: InstructorsComponent },
	{ path: 'courses',      component: CoursesComponent },
	{ path: 'scheduler',      component: SchedulerComponent },
	
    
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }
