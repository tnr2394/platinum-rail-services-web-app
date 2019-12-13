import { Component, OnInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent, MatDialog } from '@angular/material';
import { MaterialService } from "../../services/material.service";
import { LearnerService } from "../../services/learner.service";
import { JobService } from "../../services/job.service";
import { Router, NavigationExtras } from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';


@Component({
  selector: 'app-assignment-status',
  templateUrl: './assignment-status.component.html',
  styleUrls: ['./assignment-status.component.scss']
})
export class AssignmentStatusComponent implements OnInit {
  assignment;

  // displayedColumns: string[];
  learners: [];

  displayedColumns: string[] = ['name', 'email', 'actions'];
  dataSource: MatTableDataSource<any>;

  learner;
  job;
  jobId;

  constructor(private activatedRoute: ActivatedRoute, private _materialService: MaterialService, private _learnerService: LearnerService, private _jobService: JobService) {
    this.learners = [];
    this.dataSource = new MatTableDataSource(this.learners);
  }

  ngOnInit() {

    this.activatedRoute.params.subscribe(params => {
      this.jobId = params['jobid'];
      console.log("Calling getLearners with jobid = ", this.jobId);
      this.getJob(this.job);
    });


    this.getAssignmentList(this.jobId);
    this.assignmentStatusWithLearner(this.jobId);
    this.getJob(this.jobId);
  }


  getAssignmentList(jobId) {
    this._materialService.getMaterialUsingJobId(jobId).subscribe((data) => {

      this.assignment = data.assignment;

      console.log('Assignment List', this.assignment);

      this.displayedColumns = this.assignment.map(assignment => assignment.assignmentNo);

      console.log(' this.displayedColumns', this.displayedColumns);
    });
  }

  getJob(jobId) {
    var that = this;
    this._jobService.getJobById(jobId).subscribe((jobs) => {
      console.log("Job Received =  Assignment Status", jobs);
      this.job = jobs.pop();
      console.log("Setting job = ", { job: this.job });
    });
  }



  loadLearners(object) {
    console.log("OBJECT", object);
    this.learners = object.learners;
    console.log("Learners loaded by event = ", object.learners);
  }


  assignmentStatusWithLearner(jobId) {
    this._materialService.assignmentStatusWithLearner(jobId).subscribe((data) => {

      this.learner = data;
      console.log('Learner List', this.learner);


      // _.forEach(this.assignment, (singleAssignment: { [x: string]: boolean; bookMark: any; }) => {
      //   console.log('Save----->>>', singleAssignment);
      //   _.forEach(this.learner, (singleLearner: any) => {
      //     console.log('single Learner------->>', singleLearner);
      //     _.forEach(singleLearner.assignments, (singleLearnerAssignment: any) => {
      //       console.log('singleLearner-->>>', singleLearner);
      //       if (singleAssignment.assignmentId == singleLearnerAssignment.assignmentId) {
      //         console.log('Inside IF-------->>>>>>>>>>>>');
      //       } else {
      //         console.log('Inside Else-------->>>>>>>>>>>>');
      //         singleLearner.assignments.push({ assignmentId: singleAssignment.assignmentId, status: 'unassigned' });
      //       }
      //     })
      //   })
      // })




      // console.log('Assignment List after for each', this.learner);


      // _.forEach(this.learner, (singleLearner: any) => {
      //   console.log('Learner--------->>>>', singleLearner);
      //   _.forEach(singleLearner.assignments, (singleAssignment: any) => {
      //     console.log('singleAssignment--------->>>>', singleAssignment);
      //     _.forEach(this.assignment,(assignment)=>{
      //       console.log("assign",assignment.assignmentId,singleAssignment.assignmentId);
      //       if(assignment.assignmentId == singleAssignment.assignmentId){
      //         console.log("in if");

      //       }else{
      //         console.log("in else");
      //         singleLearner.assignments.push(assignment.assignmentId)
      //       }
      //     })


      // let index = this.assignment.findIndex(record => record.assignmentId === singleAssignment.assignmentId);

      // console.log(index); // 3


      // if (index < 0) {
      //   console.log('Push Status');
      // } else {
      //   console.log('Push Status else');0
      // }



      // _.findIndex(this.assignment, function (o) {
      //   let index = o.assignmentId == singleAssignment.assignmentId;

      //   console.log('Index------', index);

      //   if (index) {
      //   } else {
      //     console.log('Inside Else-------------------------');
      //   }
      // });



      // })
      // })


      // console.log("update learner ",this.learner)


    });
  }
}
