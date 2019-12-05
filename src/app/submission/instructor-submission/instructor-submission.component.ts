import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-instructor-submission',
  templateUrl: './instructor-submission.component.html',
  styleUrls: ['./instructor-submission.component.scss']
})
export class InstructorSubmissionComponent implements OnInit {

  learner;
  material;
  assignment;

  constructor(public router: Router, private activatedRoute: ActivatedRoute) { 
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
      this.learner = this.router.getCurrentNavigation().extras.state.learner;
      this.material = this.router.getCurrentNavigation().extras.state.material;
      }
    });
  }

  ngOnInit() {
    // console.log("Data recieved", this.learner,this.material)
    this.learner.allotments.forEach((item)=>{
      if(item.assignment == this.material._id){
        this.assignment = item;
        // console.log("Match found", item)
      }
      else console.log("Matech not found")
    })
  }

}
