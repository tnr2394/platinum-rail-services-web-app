import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { MaterialService } from '../../services/material.service';
import { from, Observable } from 'rxjs';
import { AddFileModalComponent } from 'src/app/files/add-file-modal/add-file-modal.component';
import { FilterService } from 'src/app/services/filter.service';
import { JobService } from 'src/app/services/job.service';
import { LearnerService } from 'src/app/services/learner.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { CreateFolderModalComponent } from 'src/app/folder/create-folder-modal/create-folder-modal.component';
import { AddMaterialModalComponent } from 'src/app/courses/materials/add-material-modal/add-material-modal.component';
import { DeleteConfirmModalComponent } from '../delete-confirm-modal/delete-confirm-modal.component';
import * as _ from 'lodash';
// import { $ } from 'protractor';
declare var $: any;
@Component({
  selector: 'material-tile',
  templateUrl: './material-tile.component.html',
  styleUrls: ['./material-tile.component.scss']
})
export class MaterialTileComponent implements OnInit {
  @Input('material') material: any;
  @Input('isSelected') isSelected: Boolean;
  @Input('index') i: any;
  @Input('jobId') jobId;
  @Input('folder') folder: any;
  @Input('learnersAllotedFromJob') learnersAlloted;
  @Input('learnersFromJob') learnersFromJob;
  @Input('allLearnersFromJob') allLearners;
  @Input('showLearnerTab') showLearnerTab;
  @Input('learnerFromSingleUnit') learnerFromSingleUnit;
  @Input('learnerWithStatus') learnerWithStatus;
  @Output() DeleteMaterial: EventEmitter<any> = new EventEmitter<any>();
  @Output() getFiles: EventEmitter<any> = new EventEmitter<any>();
  @Output() fileDetailsComp: EventEmitter<any> = new EventEmitter<any>();
  @Output() assignmentAllocated: EventEmitter<any> = new EventEmitter<any>();
  backupMaterial: any;
  isActive: string;
  editing: boolean;
  loading: boolean;
  backupmaterial: any;
  bgColors;
  lastColor;
  allotedLearners = [];
  copyLearners: any;
  temp: any;
  type: String;
  title: any;
  files: any;
  materialId: any;
  learnerLength: any;
  learner: any;
  assignedLearner: number = 0;
  pendingLearners: number = 0;
  resubmissionLearners: number = 0;
  submittedLearners: number = 0;
  completedLearners: number = 0;
  // allLearners: any;
  unassignedLearners: number = 0;
  reSubmittedLearners: number = 0;
  learnerNames = [];
  displayLearners: Boolean = false;
  displaySubFolders: boolean = false;
  allocatedLearners = [];
  allLearnersCount: any;
  duedate: any;
  today = new Date()
  learnerCopy: any;
  indexForMatTab: number = 1;
  allFiles: any;
  currentUser: any;
  hideActions: boolean;
  currentColor: string;
  link: any;

  constructor(private _materialService: MaterialService, private _learnerService: LearnerService, public dialog: MatDialog,
    public _snackBar: MatSnackBar, public router: Router, public activatedRoute: ActivatedRoute,public _filter: FilterService) {
    this.bgColors = ["btn-info", "btn-success", "btn-warning", "btn-primary", "btn-danger"];

  }
  ngOnInit() {
    console.log("learnersAlloted", this.learnersAlloted);
    console.log("learnersAllotedFromJob");
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (this.currentUser.userRole == 'client') {
      this.hideActions = true
    }
    this.activatedRoute.queryParams.subscribe(param => {
      if (param) {
        this.jobId = param['job']
        console.log("this.jobId in queryParams is", this.jobId);
      }
    })

    if (this.router.url.includes('/jobs')) {
      this.displayLearners = true
      // this.getLearners()
      // this.assignmentStatusWithLearner(this.jobId, "true")
      this.learner = this.learnersFromJob
      this.getCount()
      this.indexForMatTab = 2;
      var id = '#' + this.material._id;
      // console.log(id, "click here")
      $(id).addClass('mat-tab-label-active')
    }
    if (this.material != undefined) {
      this.backupMaterial = JSON.parse(JSON.stringify(this.material));
      this.type = this.material.type;
      this.title = this.material.title;
      this.materialId = this.material._id;
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log("*****Changes in materials tile", changes, changes.learnersAlloted);
    if (changes.folder != undefined) {
      if (changes.folder.currentValue != undefined) {
        this.type = 'folder';
        this.title = this.folder.title;
        this.files = this.folder.files;
        this.copyFiles = this.folder.files;
        this.displaySubFolders = true;
      }
    }
    if (this.displayLearners == true) {
      if (changes.jobId != undefined) {
        if (changes.jobId.currentValue != undefined) {
          this.learner = changes.learnersFromJob.currentValue
          console.log("this.learner in changes.jobId", this.learner);
          this.getCount()
          // this.assignmentStatusWithLearner(this.jobId, "true");
          // this.getLearners()
          // this.getLearnerCheck()
        }
      }
    }

    if (changes.material != undefined) {
      if (changes.material.currentValue != undefined) {
        // this.getLearnerCheck()
        this.materialId = changes.material.currentValue.material_id;
        this.assignedLearner = 0
        this.pendingLearners = 0
        this.resubmissionLearners = 0
        this.submittedLearners = 0
        this.completedLearners = 0
        this.reSubmittedLearners = 0;
        this.allFiles = changes.material.currentValue.files
      }
    }
    if (changes.learnersAlloted && changes.learnersAlloted.currentValue == true) {
      // this.learner = changes.learnersFromJob.currentValue
      // this.getCount()
      this.assignmentStatusWithLearner(this.jobId, "true")
      // this.isSelected = false;
    }
    if (changes.learnersFromJob && changes.learnersFromJob.currentValue) {
      this.learner = changes.learnersFromJob.currentValue
      console.log("***in changes.learnersFromJob", this.learner);
      this.getCount()
    }
    if (changes.allLearners && changes.allLearners.currentValue) {
      this.allLearners = changes.allLearners.currentValue;
      this.allLearnersCount = changes.allLearners.currentValue.length || 0
      console.log("this.allLearners in material tile.........", this.allLearners);
      // this.learner = changes.allLearners.currentValue
      // console.log("%%%%this.learner%%%%", this.learner);
      this.allLearners.forEach(learner => {
        learner.checked = false
      })
      this.getLearnerCheck()
      this.learnerCopy = this.allLearners;
    }
    if (changes.showLearnerTab && changes.showLearnerTab.currentValue) {
      this.displayLearners = changes.showLearnerTab.currentValue
    }
    // console.log("changes in mat tile------>>>>>>");
    if (changes.learnerWithStatus && changes.learnerWithStatus.currentValue) {
      // console.log("1111111111111changes.statusOfLearner", changes.learnerWithStatus.currentValue);
      this.learner = changes.learnerWithStatus.currentValue
      
    }
  }

  getRandomColorClass() {
    // let i = Math.floor(Math.random() * this.bgColors.length);
    var rand = Math.floor(Math.random() * this.bgColors.length);
    rand = this.i % 5;
    this.lastColor = rand;
    // console.log("RETURNING", this.bgColors[rand]);

    return this.bgColors[rand];
  }

  getMaterialFiles() {
    // console.log("INDEX IS", this.i);
    var tempId = "#" + this.materialId
    $(tempId).addClass('box_shadow_cls')
    console.log(" Yash ", tempId)
    // this.temp = this.copyLearners;
    // console.log("Getting Material ID from materialTile component", this.temp);
    if (this.material != undefined) {
      this.getFiles.emit({
        materialId: this.material._id,
      });
      if (this.learner != undefined) {
        this.getCount()
        this.getLearnerCheck()
      }
    }
    if (this.folder != undefined) {
      // console.log("folder open");
      this.fileDetails(this.folder);
    }
  }

  fileDetails(event) {
    event.materialIndex = this.i
    this.fileDetailsComp.emit(event)
    // console.log("event in material-tile", event);
  }
  closeFileDetails() {
    console.log("Expansion closed^");
    var tempId = "#" + this.materialId
    $(tempId).removeClass('box_shadow_cls')
    console.log(" Yash ", tempId)
  }
  applyFilter(filterValue: string) {
    // console.log("filterValue", filterValue);

    this.files = this._filter.filter(filterValue, this.copyFiles, ['title', 'type']);
  }
  copyFiles(filterValue: string, copyFiles: any, arg2: string[]): any {
    throw new Error("Method not implemented.");
  }
  openDialog(someComponent, data = {}): Observable<any> {
    // console.log("OPENDIALOG", "DATA = ", data);
    const dialogRef = this.dialog.open(someComponent, { data, width: '500px', height: '600px' });
    return dialogRef.afterClosed();
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  editmaterial() {
    this.openDialog(AddMaterialModalComponent, { material: this.material }).subscribe(material => {
      if (material == undefined) return
      console.log("MATERIAL%%%", material);
      this.title = material.title;
    })
    // console.log("Enabling Editing")
    // this.editing = true;
  }

  // updateMaterial() {
  //   this.loading = true;
  //   this._materialService.editMaterial(this.material).subscribe(updatedmaterial => {
  //     this.material = updatedmaterial;
  //     this.loading = false;
  //     this.editing = false;
  //   }, err => {
  //     console.error(err);
  //     this.loading = false;
  //     alert("material couldn't be updated. Please try again later.")
  //     this.material = this.backupMaterial;
  //     this.editing = false;
  //   })

  // }

  deleteMaterial() {
    this.openDialog(DeleteConfirmModalComponent, "Material").subscribe(confirm => {
      // if(confirm != undefined) return
      if (confirm == 'yes') {
        console.log("CONFIRM", confirm, this.material._id);
        // this.loading = true;
        this._materialService.deleteMaterial(this.material._id).subscribe(updatedmaterial => {
          console.log("MATERIAL SERVICE");

          this.loading = false;
          this.editing = false;
          console.log("Deleted material. ID = ", this.material._id);
          this.DeleteMaterial.emit(this.material);
        }, err => {
          console.error(err);
          this.loading = false;
          alert("material couldn't be updated. Please try again later.")
          this.material = this.backupMaterial;
          this.editing = false;
        })
      }
      else return
    })

  }

  UpateData(courses: any) {
    // throw new Error("Method not implemented.");
  }

  createFolder() {
    let currentFolder = this.folder;
    // console.log("currentFolder", this.folder);
    this.openDialog(CreateFolderModalComponent, this.folder).subscribe(folder => {
      if (folder == undefined) return
      // console.log("FOLDER NAME RECIEVED", folder);

      // this.allFolders.push(folder);
    }, error => {
      // console.log("ERROE$$$");

    })
  }
  subFolder() {
    // console.log("SUB FOLDER CLICKED");
  }
  // GET LEARNER COUNT
  getCount() {
    console.log("in get counts", this.learner);

    this.learnerNames = [];
    this.assignedLearner = 0
    this.pendingLearners = 0
    this.resubmissionLearners = 0
    this.submittedLearners = 0
    this.completedLearners = 0
    this.reSubmittedLearners = 0;
    if (this.learner) {
      this.learner.forEach(singleLearner => {
        singleLearner.assignments.forEach(assignment => {
          if (assignment.assignmentId == this.materialId) {
            this.learnerNames.push(singleLearner.learnerName)
            this.assignedLearner += 1;
            if (assignment.assignmentStatus == 'Pending') {
              this.pendingLearners += 1
            }
            else if (assignment.assignmentStatus == 'Requested for Resubmission') {
              this.resubmissionLearners += 1
            }
            else if (assignment.assignmentStatus == 'Submitted') {
              this.submittedLearners += 1
            }
            else if (assignment.assignmentStatus == 'Completed') {
              this.completedLearners += 1
            }
            else if (assignment.assignmentStatus == 'Re-submitted') {
              this.reSubmittedLearners += 1
            }
          }
          this.unassignedLearners = (this.allLearnersCount - this.assignedLearner > 0) ? this.allLearnersCount - this.assignedLearner : 0;
        })
      })
    }
  }

  onSelectChange(event, i) {
    // console.log("EVENT CHANGE", event)

    if (event.checked == true) {
      this.allocatedLearners.push(event.source.value)
    }
    if (event.checked == false) {
      this.allocatedLearners.forEach((learner) => {
        if (learner._id == event.source.value._id) {
          this.allocatedLearners.splice(learner, 1)
        }
      })
    }
    // console.log("allocated learners", this.allocatedLearners);
  }
  allocateMaterial() {
    this.assignmentAllocated.emit({ msg: 'assignment allocated from material tile' })
    this.allocatedLearners.forEach(learner => {
      this.allLearners.forEach(singleLearner => {
        if (learner._id == singleLearner._id) {
          singleLearner.checked = true
        }
      })
    })
    let learners = [];
    if (this.allocatedLearners) {
      if (this.duedate == undefined) this.duedate = this.today
      this.allocatedLearners.forEach((learner) => {
        learner.duedate = this.duedate;
        learners.push({ learner: learner, assignments: [this.material] });
      });
    }
    this._learnerService.allocateLearner(learners).subscribe(data => {
      console.log("this.jobId after allocation", this.jobId);
      this.assignmentStatusWithLearner({_id:this.jobId},"true")
      // console.log("DATA SENT", learners);
      // console.log("Response", data);
    });
    this.openSnackBar("Learners allocated", "OK")
  }
  dueDate(event) {
    this.duedate = event.value
  }

  getLearnerCheck() {
    if (this.allLearners) {
      this.allLearners.forEach(singleLearner => {

        // console.log("this.material._id", this.material._id)
        var temp = JSON.parse(JSON.stringify(this.material._id)) || null
        if (temp) {
          // console.log("singleLearner", singleLearner.allotments)

          var index1 = _.findIndex(singleLearner.allotments, function (o) {
            if (o.assignment && o.assignment._id) {
              // console.log("o.assignment._id", o.assignment._id)
              // console.log("this.material._id", temp)
              return o.assignment._id == temp;
            }
          });

          if (index1 > -1) {
            var index = _.findIndex(this.learner, function (o) { return o._id.toString() == singleLearner._id.toString(); });
            // console.log(" index ", index)
            if (index > -1) singleLearner.checked = true
            else singleLearner.checked = false
          } else {
            singleLearner.checked = false

          }


        }
        else {
          singleLearner.checked = false
        }
      })
      // }
      // console.log("THIS.ALLLEARNERS", this.allLearners);
    }
  }
  filter(filterValue: string) {
    this.allLearners = this._filter.filter(filterValue, this.learnerCopy, ['name']);
  }
  getToolTipData(learner,i) {
    let tempLearner = this.allLearners[i]
    let materialId = this.materialId
    // console.log("learner in getToolTipData", learner)
    // return i
    if (this.allLearners && this.learner) {
      var index = _.findIndex(this.learner, function (o) { return o._id == tempLearner._id })
      if (index > -1) {
        var index2 = _.findIndex(this.learner[index].assignments, function (o) { return o.assignmentId == materialId })
        if (index2 > -1){
          this.link = '/learnerAllotment/' + this.learner[index].assignments[index2].allotmentId
          if (this.learner[index].assignments[index2].assignmentStatus == 'Pending' ) this.currentColor = '#d11919'
          else if (this.learner[index].assignments[index2].assignmentStatus == 'Requested for Resubmission') this.currentColor = '#ffb03b'
          else if (this.learner[index].assignments[index2].assignmentStatus == 'Submitted') this.currentColor = '#3b86ff'
          else if (this.learner[index].assignments[index2].assignmentStatus == 'Completed') this.currentColor = '#64fe00'
          else if (this.learner[index].assignments[index2].assignmentStatus == 'Re-submitted') this.currentColor = '#acc7ef'
          return this.learner[index].assignments[index2].assignmentStatus
        }
        else {
          this.link = '/learner/' + tempLearner._id
          this.currentColor = '#ffeb3b'
          return 'Unassigned'
        }
      }
      // return this.learner[index].assignments[0].assignmentStatus
    }
    else {
      this.link = '/learner/' + tempLearner._id
      this.currentColor = '#ffeb3b'
      return 'Unassigned'
    }
  }
 
  // }
  // console.log("THIS.ALLLEARNERS", this.allLearners);

  // API
  // getLearners() {
  //   this._learnerService.getLearnersByJobId(this.jobId).subscribe(allLearners => {
  //     console.log("**allLearners", allLearners);
  //     this.allLearnersCount = allLearners.length || 0
  //     this.allLearners = allLearners
  //     this.allLearners.forEach(learner => {
  //       learner.checked = false
  //     })
  //     this.getLearnerCheck()
  //     this.learnerCopy = this.allLearners;
  //   })
  // }

  assignmentStatusWithLearner(jobId, doGetCount) {
    this._materialService.assignmentStatusWithLearner(jobId).subscribe((data) => {
      this.learner = JSON.parse(JSON.stringify(data));
      console.log("*****assignmentStatusWithLearner have to display this all", this.learner);
      if (doGetCount == "true") this.getCount()
      this.learnerLength = data.length;
    });
  }
}
