import { Component, OnInit } from '@angular/core';
import { MaterialService } from '../../services/material.service';
import { LearnerService } from '../../services/learner.service';
import { JobService } from '../../services/job.service';
import { CourseService } from '../../services/course.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent, MatDialog } from '@angular/material';
import { FilterPipe } from 'ngx-filter-pipe';

@Component({
  selector: 'app-learner-dashboard',
  templateUrl: './learner-dashboard.component.html',
  styleUrls: ['./learner-dashboard.component.scss']
})
export class LearnerDashboardComponent implements OnInit {

  jobId;
  loadingMaterials: Boolean;
  learner;
  learnerName = '';
  loading = false;
  materialId = [];
  searchText;
  searchtext;
  assignments;
  courseId;
  material = [];
  bgColors: string[];
  lastColor;
  job;
  profilePath;
  mobile;
  email;
  panelOpenState = true;
  currentUser;
  userFilter: any = { title: '' };

  displayedColumns: string[] = ['Assignment', 'Status', 'View'];
  dataSource: MatTableDataSource<any>;
  paginator: MatPaginator;

  constructor(private filterPipe: FilterPipe, private activatedRoute: ActivatedRoute, public _materialService: MaterialService, public _learnerService: LearnerService, public _jobService: JobService, public _courseService: CourseService, private router: Router) {
    this.bgColors = ["bg-info", "bg-success", "bg-warning", "bg-primary", "bg-danger"];
  }

  ngOnInit() {
    this.loadingMaterials = true;
    this.getAllotments();
    this.currentUser = JSON.parse(localStorage.currentUser);
  }

  getAllotments() {
    this.loading = true;
    this.activatedRoute.params.subscribe(params => {
      console.log(params['id']);
      this._learnerService.getLearner(params['id']).subscribe(data => {
        console.log("RECEIVED = ", data);
        this.learner = data.pop();
        console.log("This.learner", this.learner)
        this.learnerName = this.learner.name;
        this.mobile = this.learner.phone;
        this.email = this.learner.email;
        this.profilePath = this.learner.profilePic;
        this.learner.allotments.forEach((assignment) => {
          this.assignments = this.learner.allotments;
        })
        console.log("ASSIGNMENTS", this.assignments)
        this.dataSource = new MatTableDataSource(this.assignments);
        this.loading = false;
        // console.log("ASSIGNMENTS", this.assignments.pop().assignment.title)
        if (this.learner.job == null) {
          console.log("LEARNER HAS NO JOB")
        }
        else {
          this.jobId = this.learner.job._id;
          console.log("JOBID", this.jobId)
          this.getJob()
        }
      });
    })
  }

  getJob() {
    this._jobService.getJobById(this.jobId).subscribe((job) => {
      console.log("Recieved job", job)
      this.job = job[0];
      job.forEach((job) => {
        if (this.jobId == job._id) {
          this.courseId = job.course._id;
        }
      })
      this.getMaterials();
    })
  }

  getMaterials() {
    this._courseService.getCourse(this.courseId).subscribe((material) => {
      console.log("RECIEVED", material)
      let recievedMaterial = material.pop()
      this.loadingMaterials = false;
      recievedMaterial.materials.forEach((material) => {
        if (material.type == "Reading") {
          this.material.push(material);
        }
      })
    })
  }

  getRandomColorClass(i) {
    var rand = Math.floor(Math.random() * this.bgColors.length);
    rand = i % 5;
    this.lastColor = rand;
    return this.bgColors[rand];
  }

  applyFilter(filterValue: string) {
    if (filterValue == '') {
      this.dataSource = new MatTableDataSource(this.assignments);
    } else {
      let finalarray = [];
      this.assignments.forEach((e1) => {
        if (e1.assignment.assignmentNo == filterValue || e1.assignment.unitNo == filterValue) {
          finalarray.push(e1)
        }
      })
      this.dataSource = new MatTableDataSource(finalarray);
    }
  }



  showMaterialFiles(material) {
    let navigationExtras: NavigationExtras = {
      state: {
        material: material
      }
    };
    this.router.navigateByUrl('/learnerReadingMaterial', navigationExtras);
  }

  showAllotmentTile(assignment) {
    console.log("ASSIGNMENT", assignment)
    let navigationExtras: NavigationExtras = {
      state: {
        assignment: assignment
      }
    };
    this.router.navigateByUrl('/learnerAllotment/' + assignment._id, navigationExtras);
  }

}
