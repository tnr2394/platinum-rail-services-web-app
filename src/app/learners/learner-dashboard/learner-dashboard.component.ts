import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MaterialService } from '../../services/material.service';
import { LearnerService } from '../../services/learner.service';
import { JobService } from '../../services/job.service';
import { CourseService } from '../../services/course.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent, MatDialog, MatSort } from '@angular/material';
import { FilterPipe } from 'ngx-filter-pipe';
import { trigger, transition, query, animateChild, state, style, animate, useAnimation } from '@angular/animations';
import { bounce } from 'ng-animate';
import { FilterService } from 'src/app/services/filter.service';
import * as _ from 'lodash';
declare var $: any;

export const FLIP_TRANSITION = [
  trigger(
    'inOutAnimation',
    [
      transition(
        ':enter',
        [
          style({ opacity: 0 }),
          animate('0.5s ease-in-out',
            style({ opacity: 1 }))
        ]
      ),
      transition(
        ':leave',
        [
          style({ opacity: 1 }),
          animate('0s ease-in',
            style({ opacity: 0 }))
        ]
      )
    ]
  ),
  trigger('bounce', [transition('* => *', useAnimation(bounce))]),
];




@Component({
  selector: 'app-learner-dashboard',
  templateUrl: './learner-dashboard.component.html',
  styleUrls: ['./learner-dashboard.component.scss'],
  animations: [FLIP_TRANSITION]
})
export class LearnerDashboardComponent implements OnInit {


  @Input('isActive') isActive: Boolean;
  @Input('location') location: any;
  // @Output() onDeleted: EventEmitter<any> = new EventEmitter<any>();

  editing: boolean = false;
  editing1: boolean = false;
  editing2: boolean = false;
  backupLocation;
  bounce: any;

  exam1 =
    { id: '0', display: 'Exam-1', status: 'Pass' };

  exam2 =
    { id: '0', display: 'Exam-1', status: 'Pass' };

  assignmentStatus = [
    { id: '0', display: 'Completed', status: 'Completed', checked: false },
    { id: '0', display: 'Pending', status: 'Pending', checked: false },
    { id: '1', display: 'Re-Submitted', status: 'Re-submitted', checked: false },
    { id: '2', display: 'Resubmit Requestted', status: 'Requested for Resubmission', checked: false },
    { id: '3', display: 'Submitted', status: 'Submitted', checked: false },
  ];

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

  displayedColumns: string[] = ['Assignment', 'DueDate', 'Status', 'View'];
  dataSource: MatTableDataSource<any>;
  paginator: MatPaginator;
  sort: MatSort;
  pageEvent: PageEvent;
  learnerId: any;
  filteredData: any = [];
  assignmentsCopy: any;

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  @ViewChild(MatPaginator, { static: true }) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  constructor(private filterPipe: FilterPipe, private activatedRoute: ActivatedRoute, public _materialService: MaterialService, public _learnerService: LearnerService, public _jobService: JobService, public _courseService: CourseService, private router: Router, public _filter:FilterService) {
    this.bgColors = ["bg-info", "bg-success", "bg-warning", "bg-primary", "bg-danger"];
    this.dataSource = new MatTableDataSource<any>(this.assignments);
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
      this.learnerId = params['id'];
      console.log("++++++++++", this.learnerId);
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
          this.assignmentsCopy = this.assignments;
        })
        console.log("ASSIGNMENTS", this.assignments)
        this.dataSource = new MatTableDataSource(this.assignments);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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


  select() {
    alert("Selected" + this.isActive);
  }

  editStatus1() {
    this.editing1 = true;
  }

  editStatus2() {
    this.editing2 = true;
  }

  updateStatus1() {
    this.editing1 = false;
  }
  updateStatus2() {
    this.editing2 = false;
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

  selectedStatus(event, index, status) {
    console.log("event", event, "index", index, "status", status);
    if (event == true) {
      this.assignmentsCopy = this._filter.filter(status,this.assignments,['status']);
      this.filteredData = this.filteredData.concat(this.assignmentsCopy)
      this.dataSource = this.filteredData
    }
    else if (event == false) {
      this.filteredData = _.remove(this.filteredData, function(o) { return o.status != status })
      this.dataSource = this.filteredData
      if(this.filteredData.length == 0) { this.dataSource = new MatTableDataSource<any>(this.assignments)}
    }
    console.log("this.assignmentsCopy", this.assignmentsCopy);
    console.log("this.filteredData", this.filteredData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // this.filterUsingStatus(this.sepArray);
  }


  // filterUsingStatus(assignment) {
  //   if (!assignment.length) {
  //     this.updateData(this.learners);
  //   } else {
  //     const finalarray = [];
  //     this.learners.forEach((e1) => assignment.forEach((e2) => {
  //       if (e1.assignmentStatus == e2) {
  //         finalarray.push(e1)
  //       }
  //     }));
  //     this.updateData(finalarray);
  //   }
  // }

  // updateData(learner) {
  //   console.log("UPDATING DATA = ", learner)
  //   this.dataSource = new MatTableDataSource(learner);
  //   this.finalLearner = learner;
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  //   console.log("SETTING SORT TO = ", this.dataSource.sort)
  //   console.log("SETTING paginator TO = ", this.dataSource.paginator)
  // }
}
