import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LearnerService } from '../../services/learner.service'

@Component({
  selector: 'app-instructor-submission',
  templateUrl: './instructor-submission.component.html',
  styleUrls: ['./instructor-submission.component.scss']
})
export class InstructorSubmissionComponent implements OnInit {

  learner;
  title;
  unitNo;
  assignmentNo;
  assignment;
  displayData = [];
  display : Boolean = false;

  constructor(public _learnerService: LearnerService,public router: Router, private activatedRoute: ActivatedRoute) { 
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
      this.learner = this.router.getCurrentNavigation().extras.state.learner;
      this.title = this.router.getCurrentNavigation().extras.state.title;
      this.unitNo = this.router.getCurrentNavigation().extras.state.unitNo;
      this.assignmentNo = this.router.getCurrentNavigation().extras.state.assignmentNo;
      }
    });
  }

  ngOnInit() {
    this.getAllotments()
    console.log("Data recieved", this.learner,this.title, this.unitNo, this.assignmentNo)
  }
  getAllotments() {
    // console.log(this.learner);
    this._learnerService.getLearner(this.learner._id).subscribe(data => {
        console.log("RECEIVED = ", data)
        data.forEach((item)=>{
          // console.log(item.allotments)
          item.allotments.forEach((item)=>{
            if (item.assignment != null) {
            if (item.assignment.title == this.title 
              || item.assignmet.unitNo == this.unitNo 
              || item.assignment.assignmentNo == this.assignmentNo)
              {
                this.displayData.push(item)
              }
            }
          })
        })
      });
      console.log("displayData", this.displayData)
  }
}
