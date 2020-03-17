import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterService } from 'src/app/services/filter.service';
import { SearchPipe } from 'src/app/search.pipe';
import * as _ from 'lodash';
import { CourseService } from 'src/app/services/course.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AddMaterialModalComponent } from '../materials/add-material-modal/add-material-modal.component';

import { Observable } from 'rxjs';
import { AllocateLearnerModalComponent } from 'src/app/jobs/job/allocate-learner-modal/allocate-learner-modal.component';
import { LearnerService } from 'src/app/services/learner.service';
import { AssignmentStatusComponent } from 'src/app/clients/assignment-status/assignment-status.component';
import { MaterialService } from 'src/app/services/material.service';

@Component({
  selector: 'app-single-unit',
  templateUrl: './single-unit.component.html',
  styleUrls: ['./single-unit.component.scss'],
  providers: [SearchPipe]
})
export class SingleUnitComponent implements OnInit {
  allMaterials: any;
  allMaterialsCopy: any;
  selectedMaterial: any;
  files: any;

  unitNo: any;
  courseId: any;
  groupedMaterials: any;
  learnersAlloted = false;
  sendDataToAllocateModal: { learners: any; materials: number; };
  materials: any;
  learners: any;
  allLearners: any;
  private sub: any

  @Output() openFilesSideNav: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(AssignmentStatusComponent, { static: false }) assignmentStatusComp: AssignmentStatusComponent;
  clearCheckBox: boolean;
  learnerAssignmentStatus: any;
  jobId: any;
  constructor(private activatedRoute: ActivatedRoute, private router: Router, public _filter: FilterService,
    public _courseService: CourseService, public _learnerService: LearnerService,
    public dialog: MatDialog, public _snackBar: MatSnackBar,
    private _materialService: MaterialService) {
    if (this.router.getCurrentNavigation().extras.state) {
      this.allMaterials = this.router.getCurrentNavigation().extras.state.material;
      this.learners = this.router.getCurrentNavigation().extras.state.learnersFromComponent;
      this.jobId = this.router.getCurrentNavigation().extras.state.jobId
      this.courseId = this.router.getCurrentNavigation().extras.state.courseId

    }
    else {
      this.sub = this.activatedRoute.queryParams.subscribe(param => {
        console.log("activated params", param);
      })
      console.log("---No STATE---");
    }
  }

  ngOnInit() {
    console.log("this.courseId", this.courseId);
    console.log("learnersFromComponent in singleUnit", this.learners);

    if (this.allMaterials) {
      this.allMaterialsCopy = JSON.parse(JSON.stringify(this.allMaterials))
      this.assignmentStatusWithLearner()
      this.getLearners(this.jobId)
    }
    else {
      this.activatedRoute.queryParams.subscribe(params => {
        console.log("params", params);
        this.unitNo = params['unit']
        this.courseId = params['course']
        this.jobId = params['job']
        this.getGroupedMaterials(params['course'])
        this.assignmentStatusWithLearner()
        this.getLearners(this.jobId)
      })
    }
  }

  fileDetailsComp(event) {
    console.log("*****fileDetailsComp", event);
    this.openFilesSideNav.emit({ event })
    // this.materialIndex = event.materialIndex
    // this.file = event.file;
    // this.mydsidenav.open();
    // console.log("EVENT OPENING", event.file);
  }
  filter(searchText) {
    console.log("-----searchText-----", searchText);
    if (searchText == ' ' || searchText == null) {
      this.allMaterials = this.allMaterialsCopy
    }
    else {
      let tempAssignments = _.filter(this.allMaterialsCopy.materialsAssignment, function (o) {
        console.log("o.title", o.title);
        return o.title.toLowerCase().includes(searchText)
      })
      let tempReading = _.filter(this.allMaterialsCopy.materialsReading, function (o) {
        console.log("o.title", o.title);
        return o.title.toLowerCase().includes(searchText)
      })

      this.allMaterials.materialsAssignment = []
      this.allMaterials.materialsReading = []

      if (tempAssignments.length > 0) {
        console.log("tempAssignments:::::", tempAssignments);
        this.allMaterials.materialsAssignment.push(...tempAssignments)
      }
      if (tempReading.length > 0) this.allMaterials.materialsReading.push(...tempReading)
      console.log("this.allMaterials:::::", this.allMaterials);
      console.log("this.allMaterialsCopy:::", this.allMaterialsCopy)
    }
  }

  getGroupedMaterials(courseId) {
    console.log("getting materials in materials component for courseId = ", courseId)
    this._courseService.getCourseGrouped(courseId).subscribe((groupedmaterial: any) => {
      console.log('groupedmaterial in single Unit', groupedmaterial);
      if (groupedmaterial.material.length > 0) {
        this.groupedMaterials = groupedmaterial.material
        console.log("this.groupedMaterials", this.groupedMaterials);
        let unit = this.unitNo
        var index = _.findIndex(this.groupedMaterials, function (o) {
          console.log("o._id", o._id, "===", unit);
          return o._id == unit
        })
        console.log("index", index, this.groupedMaterials[index]);
        if (index > -1) {
          console.log("index", index, this.groupedMaterials[index]);
          this.allMaterials = this.groupedMaterials[index]
          this.allMaterialsCopy = JSON.parse(JSON.stringify(this.allMaterials))
        }
      }
      else {
        console.log("NOT FOUND");
      }
    });
  }
  addMaterialModal() {
    var addedMaterial = this.openDialog(AddMaterialModalComponent, { course: this.courseId }).subscribe((materials) => {
      console.log("*****materials*****", materials);
      if (materials == undefined) return;
      // this.material.push(materials);
      // console.log("MATERIAL ADDED IS", materials);
      // this.loading = false;
      // this.openSnackBar("Material Added Successfully", "Ok");
      // this.updateData(this.material);
      // this.assignmentStatus.forEach(status => {
      //   status.checked = true
      // })
      // if (materials.type == "Assignment") {
      //   this.assignmentAdded.emit({ assignmentAdded: 'Done!' })
      // }
    }, err => {
      return this.openSnackBar("Material could not be Added", "Ok");
    });
  }
  // loadLearners(object) {
  //   console.log("OBJECT", object);
  //   this.learners = object.learners;
  //   console.log("Learners loaded by event = ", object.learners);
  // }
  loadMaterials(object) {
    this.materials = object.materials;
    console.log('OBJECT', object);
    this.sendDataToAllocateModal = {
      learners: this.learners,
      materials: this.materials.length
    }
  }
  allocateLearners() {
    this.learnersAlloted = false
    this.openDialog(AllocateLearnerModalComponent, this.sendDataToAllocateModal).subscribe((allocatedLearners) => {
      if (allocatedLearners == undefined) return
      let learners = [];
      if (allocatedLearners) {
        allocatedLearners.forEach((learner) => {
          learners.push({ learner: learner, assignments: this.materials });
        });
      }
      this._learnerService.allocateLearner(learners).subscribe(data => {
        console.log("DATA SENT", learners);
        this.learnersAlloted = true
        console.log("*****this.learnersAlloted", this.learnersAlloted);
        // this.assignmentStatusComp.ngOnInit();
      });
      this.clearCheckBox = true;
      // this.materialsComp.clearCheckBox();
      this.openSnackBar("Materials Allocated Successfully", "Ok");
    }, err => {
      return this.openSnackBar("Materials could not be allocated", "Ok");
    });
  }
  handleSnackBar(data) {
    this.openSnackBar(data.msg, data.button);
  }

  openDialog(someComponent, data = {}): Observable<any> {
    console.log("OPENDIALOG", "DATA = ", data);
    const dialogRef = this.dialog.open(someComponent, { data });
    return dialogRef.afterClosed();
  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }



  getLearners(jobId) {
    this._learnerService.getLearnersByJobId(jobId).subscribe(responseLearner => {
      this.allLearners = responseLearner;
      this.learners = this.allLearners
      console.log("***this.allLearners in job", this.allLearners);
    })
  }
  assignmentStatusWithLearner() {
    console.log("this.jobId in assignmentStatusWithLearner", this.jobId);
    let data = {
      _id: this.jobId,
    }
    this._materialService.assignmentStatusWithLearner(data).subscribe(responseData => {
      console.log("assignmentStatusWithLearner responseData", responseData);
      this.learnerAssignmentStatus = responseData
    })
  }
}
