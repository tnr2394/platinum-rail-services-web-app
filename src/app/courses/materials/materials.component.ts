import { Component, OnInit, ViewChild, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { MaterialService } from '../../services/material.service';
import { LearnerService } from '../../services/learner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent, MatDialog, MatSidenav } from '@angular/material';
import { AddMaterialModalComponent } from './add-material-modal/add-material-modal.component';
import { EditMaterialModalComponent } from './edit-material-modal/edit-material-modal.component';
import { FilterService } from "../../services/filter.service";
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _ from 'lodash';




@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss']
})
export class MaterialsComponent implements OnInit {
  file: any;
  materialIndex: any;
  groupedMaterials: any;
  courseIdForUnits: any;
  currentUser: any;
  hideActions: boolean;
  clearCheckBox() {
    console.log("CHILD METHOD");
    this.selectedCheckbox = false;
  }
  // @Input('courseid') courseId: any;
  @Input('data') data: any;
  @Input('jobId') jobId;
  @Input('materials') materialsFromJob;
  @Input('learnersAllotedFromJob') learnersAlloted = false;
  @Input('learnersFromJob') learnersFromJob;
  @Input('allLearnersFromJob') allLearners;
  @Input('learnersFromComponent') learnersFromComponent;
  @Output() getMaterialsFromComponent: EventEmitter<any> = new EventEmitter<any>();
  @Output() showBtn: EventEmitter<any> = new EventEmitter<any>();
  @Output() assignmentAdded = new EventEmitter<any>();
  @Output() assignmentAllocated: EventEmitter<any> = new EventEmitter<any>();
  @Output() openFilesSideNav: EventEmitter<any> = new EventEmitter<any>();
  materials: any = [];
  bgColors: string[];
  lastColor;
  length;
  pageSizeOptions: number[] = [10, 25, 100];
  course;
  dataSource: MatTableDataSource<any>;
  paginator: MatPaginator;
  sort: MatSort;
  files;
  selectedMaterial: any;
  selectedMaterials = [];
  courseId;
  displayAllocate: Boolean = true;
  allMaterials: Observable<any>;
  displayedColumns: string[] = ['Materials'];
  copyMaterials;
  selectedCheckbox: Boolean;
  view: Boolean = false;
  loading: Boolean;
  panelOpenState: boolean = false;
  selectedCopy;
  typeArray = ['Assignment', 'Reading'];

  assignmentStatus = [
    { id: '0', display: 'Assignment', status: 'Assignment', checked: true },
    { id: '1', display: 'Reading', status: 'Reading', checked: true },
  ];


  // getMaterialsFromComponent;
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

  @ViewChild('sidenav', { static: false }) public mydsidenav: MatSidenav;
  @Input('deletedFile') deletedFile: any;

  constructor(public _learnerSerice: LearnerService, public _courseService: CourseService, public _materialService: MaterialService, public dialog: MatDialog, public _filter: FilterService, public _snackBar: MatSnackBar, private activatedRoute: ActivatedRoute, private router: Router) {
    this.bgColors = ["badge-info", "badge-success", "badge-warning", "badge-primary", "badge-danger"];
    this.materials = [];
    // this.allMaterials = this.materials[];
    this.dataSource = new MatTableDataSource(this.materials);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("*****Changes in app materials", changes);
    if (this.jobId != undefined && changes.jobId) {
      this.jobId = changes.jobId.currentValue;
      console.log("in single job page=====>>>>>>>>>",changes.data.currentValue);
      this.getGroupedMaterials(this.data)
      console.log("this.learners", this.jobId);
    }
    if (changes.materialsFromJob && changes.materialsFromJob.currentValue){
      this.materials = this.materialsFromJob
      this.copyMaterials = this.materialsFromJob;
      this.loading = false
      this.updateData(this.materials)
    }
    if (changes.allLearners && changes.allLearners.currentValue){
      this.allLearners = changes.allLearners.currentValue
    }
  }
  ngAfterViewInit() {
    console.log("AfterViewInit this.courseId = ", this.courseId);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log("DATASOURCE", this.dataSource)
    console.log('materialsDiaplay', this.materials);
  }

  applyFilter(filterValue: string) {
    // console.log("IN APPLY FILTER")
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log("this.dataSource.paginator", this.dataSource.paginator)

    console.log("THIS.MATERIALS IS", this.materials);

    // this.dataSource = this._filter.filter(filterValue, this.materials, ['title','type']);
    this.materials = this._filter.filter(filterValue, this.selectedCopy, ['title', 'type']);
    this.updateData(this.materials)
    this.dataSource.paginator = this.paginator;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getRandomColorClass(i) {
    var rand = Math.floor(Math.random() * this.bgColors.length);
    rand = i % 5;
    this.lastColor = rand;
    return this.bgColors[rand];
  }
  ngOnInit() {
    this.loading = true;
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (this.currentUser.userRole == 'client') {
      this.hideActions = true
    }
    console.log("this.activatedRoute", this.activatedRoute.params)
    this.activatedRoute.params.subscribe(params => {
      if (params['courseId'] != undefined) {
        this.courseIdForUnits = params['courseId']
        this.getMaterials(params['courseId']);
        this.getGroupedMaterials(params['courseId'])
      }
    });

    if (this.router.url.includes('/materials')) {
      this.view = true;
      console.log("VIEW VALUE IS", this.view)
    }
    this.courseId = this.data;
    if(this.data){
      console.log("this.data found at =====>>>>>", this.data);
      this.courseIdForUnits = this.data
    }
    // this.courseIdForUnits
    // console.log("Initialized Materials with course = ", this.courseId, { data: this.data });
    if (this.courseId) {
      console.log("CourseId  ", this.courseId);
      this.materials = this.materialsFromJob
      this.updateData(this.materials)
      // this.getMaterials(this.courseId);
    }
    const paginatorIntl = this.paginator._intl;
    paginatorIntl.nextPageLabel = '';
    paginatorIntl.previousPageLabel = '';
  }
  onMaterialSelection(event) {
    console.log("event", event);
    console.log("this.selectedMaterials", this.selectedMaterials);

    if (event.checked == true) {
      this.selectedMaterials.push(event.source.value)
    }
    if (event.checked == false) {
      var index = _.findIndex(this.selectedMaterials, function (o) { return o._id == event.source.value._id })
      console.log("index", index);
      if (index > -1) {
        this.selectedMaterials.splice(index, 1)
      }
      // this.selectedMaterials.forEach((material) => {
      //   console.log('MATERIAL', material)
      //   if (material._id == event.source.value._id) {
      //     this.selectedMaterials.splice(material, 1)
      //   }
      // })
    }
    console.log("MATERIALS ARRAY IS", this.selectedMaterials)
    this.getMaterialsFromComponent.emit({ materials: this.selectedMaterials })
    console.log("event emited")
  }

  // UTILITY

  updateData(updateData) {
    console.log("UPDATING DATA Called = ", updateData);
    this.getMaterialsFromComponent.emit({ materials: this.selectedMaterials })
    this.dataSource = new MatTableDataSource(updateData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log("SETTING SORT TO = ", this.dataSource.sort)
    console.log("SETTING paginator TO = ", this.dataSource.paginator)
    this.loading = false;
  }

  selectedStatus(event, index, status) {
    console.log("event", event, "index", index, "status", status);
    if (event == true) {
      this.typeArray.push(status);
    }
    else if (event == false) {
      const index = this.typeArray.indexOf(status);
      if (index > -1) {
        this.typeArray.splice(index, 1);
      }
    }
    this.filterUsingStatus(this.typeArray);
  }


  filterUsingStatus(assignment) {
    if (!assignment.length) {
      this.dataSource = new MatTableDataSource(this.materials);
    } else {
      const finalarray = [];
      this.copyMaterials.forEach((e1) => assignment.forEach((e2) => {
        if (e1.type == e2) {
          finalarray.push(e1)
        }
      }));
      console.log('Selected Copy::::', this.selectedCopy);
      this.selectedCopy = finalarray;
      this.updateData(this.selectedCopy);
    }
  }
  deleteFile(event) {
    console.log("IN delete function", event);
    console.log("this.materials[this.materialIndex].files", this.materials[this.materialIndex].files);

    var index = _.findIndex(this.materials[this.materialIndex].files, function (o) {
      console.log("o._id", o, "event.fileId", event.fileId);
      return o == event.fileId.toString();
    })
    if (index > -1) this.materials[this.materialIndex].files.splice(index, 1)
    console.log("this.materials[this.materialIndex].files", this.materials[this.materialIndex].files);
    console.log(" dataSource ", this.dataSource)
    // this.dataSource = [];
    // this.dataSource = new MatTableDataSource([]);
    console.log(" dataSource ", this.dataSource)

    console.log("this.materials", this.materials)
    this.dataSource = new MatTableDataSource(JSON.parse(JSON.stringify(this.materials)));
    console.log(" dataSource ", this.dataSource)
    this.mydsidenav.close()
    // this.dataSource = this.materials;

  }



  // MODALS
  addMaterialModal() {
    var addedMaterial = this.openDialog(AddMaterialModalComponent, { course: this.course._id }).subscribe((materials) => {
      if (materials == undefined) return;
      // this.materials.push(materials);
      console.log("MATERIAL ADDED IS", materials);
      var index = _.findIndex(this.groupedMaterials.material, function (o) {
        console.log("o._id", o._id, "materials.unitNo", materials.unitNo);
         return o._id == materials.unitNo
        })
      console.log("index is ", index);
      if(index > -1){
        console.log("in if");
        if (materials.type == 'Reading') {
          console.log("materials.type===>>>", materials.type);
          this.groupedMaterials.material[index].materialsReading.push(materials)
        }
        else {
          console.log("materials.type===>>>", materials.type);
          this.groupedMaterials.material[index].materialsAssignment.push(materials)
        }
      }
      else {
        let data = {
          _id: materials.unitNo,
          materialsReading : [],
          materialsAssignment : []
        }
        if (materials.type == 'Reading'){
          data.materialsReading.push(materials)
        }
        else data.materialsAssignment.push(materials)
        this.groupedMaterials.material.push(data)
      }
      this.loading = false;
      this.openSnackBar("Material Added Successfully", "Ok");
      this.updateData(this.groupedMaterials);
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


  editMaterialModal(index, data) {
    this.openDialog(EditMaterialModalComponent, data).subscribe((material) => {
      console.log("DIALOG CLOSED", material)
      // Handle Error
      if (material.result == "err") return this.openSnackBar("material could not be edited", "Ok");

      // EDIT HANDLE
      if (material.action == 'edit') {
        console.log("HANDLING EDIT SUCCESS", material.data);
        data = material.data;
        var Index = this.materials.findIndex(function (i) {
          return i._id === data._id;
        })
        this.materials[Index] = material.data;
      }
      // DELETE HANDLE
      else if (material.action == 'delete') {
        console.log("Deleted ", material);
      }
      this.updateData(this.materials);
      this.handleSnackBar({ msg: "material Edited Successfully", button: "Ok" });
    });
  }

  deletedMaterial(event) {
    console.log("Material Deleted Event : ", event);
    this.materials.splice(this.materials.findIndex(function (i) {
      return i._id === event._id;
    }), 1);
    console.log("material deleted", this.materials);
    this.updateData(this.materials)
  }

  loadMaterialFiles(event) {
    console.log("loadMaterialFiles Called with event = ", event)
    this.selectedMaterial = event.materialId;
    console.log("Setting selectedMaterial = ", event.materialId)
    this.files = event.files;
  }
  fileDetailsComp(event) {
    console.log("fileDetailsComp", event);
    this.openFilesSideNav.emit({event})
    // this.materialIndex = event.materialIndex
    // this.file = event.file;
    // this.mydsidenav.open();
    // console.log("EVENT OPENING", event.file);
  }
  allocatedFromTile(event){
    console.log("In material", event);
    this.assignmentAllocated.emit({msg:"assignment allocated from material tile"})
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

  // API CALLS

  getMaterials(courseId) {
    console.log("getting materials in materials component for courseId = ", courseId)
    this._courseService.getCourse(courseId).subscribe((courses: any) => {
      console.log('GETTING ');

      this.course = courses.pop();
      this.materials = this.course.materials;

      console.log('This material:::', this.materials, this.course);
      this.loading = false;
      this.dataSource = new MatTableDataSource(this.materials);
      this.copyMaterials = this.materials;
      this.updateData(this.materials)
    });
  }
  getGroupedMaterials(courseId) {
    console.log("getting materials in materials component for courseId = ", courseId)
    this._courseService.getCourseGrouped(courseId).subscribe((groupedmaterial: any) => {
      console.log('groupedmaterial ', groupedmaterial);
      this.groupedMaterials = groupedmaterial
      this.loading = false;
    });
  }
}
