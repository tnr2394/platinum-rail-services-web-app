import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { MaterialService } from '../../services/material.service';
import { LearnerService } from '../../services/learner.service';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';

import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent, MatDialog } from '@angular/material';
import { AddMaterialModalComponent } from './add-material-modal/add-material-modal.component';
import { EditMaterialModalComponent } from './edit-material-modal/edit-material-modal.component';
import { FilterService } from "../../services/filter.service";
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss']
})
export class MaterialsComponent implements OnInit {
  clearCheckBox() {
    console.log("CHILD METHOD");
    this.selectedCheckbox = false;
  }
  // @Input('courseid') courseId: any;
  @Input('data') data: any;
  @Output() getMaterialsFromComponent: EventEmitter<any> = new EventEmitter<any>();
  @Output() showBtn: EventEmitter<any> = new EventEmitter<any>();
  @Output() assignmentAdded = new EventEmitter<any>();

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


  constructor(public _learnerSerice: LearnerService, public _courseService: CourseService, public _materialService: MaterialService, public dialog: MatDialog, public _filter: FilterService, public _snackBar: MatSnackBar, private activatedRoute: ActivatedRoute, private router: Router) {
    this.bgColors = ["badge-info", "badge-success", "badge-warning", "badge-primary", "badge-danger"];
    this.materials = [];
    // this.allMaterials = this.materials[];
    this.dataSource = new MatTableDataSource(this.materials);

    // this._learnerSerice.isSelected.subscribe(res => {

    //   console.log('Res received', res);
    //   this.selectedCheckbox = false;

    // })

  }

  // public childMethod(){
  //   console.log("MATERIAL COMPONENT CHILD METHOD")
  // }


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
    // console.log("this.dataSource.filter", this.dataSource.filter)
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    console.log("THIS.MATERIALS IS", this.materials);

    // this.dataSource = this._filter.filter(filterValue, this.materials, ['title','type']);
    this.materials = this._filter.filter(filterValue, this.copyMaterials, ['title', 'type']);
    this.dataSource.paginator = this.paginator;
  }

  getRandomColorClass(i) {
    var rand = Math.floor(Math.random() * this.bgColors.length);
    rand = i % 5;
    this.lastColor = rand;
    return this.bgColors[rand];
  }
  ngOnInit() {
    this.loading = true;
    console.log("this.activatedRoute", this.activatedRoute.params)
    this.activatedRoute.params.subscribe(params => {
      if (params['courseId'] != undefined) {
        this.getMaterials(params['courseId']);
      }
    });

    if (this.router.url.includes('/materials')) {
      this.view = true;
      console.log("VIEW VALUE IS", this.view)
    }
    this.courseId = this.data;
    console.log("Initialized Materials with course = ", this.courseId, { data: this.data });
    if (this.courseId) {
      console.log("CourseId  ", this.courseId);
      this.getMaterials(this.courseId);
    }
  }
  onMaterialSelection(event) {
    if (event.checked == true) {
      this.selectedMaterials.push(event.source.value)
    }
    if (event.checked == false) {
      this.selectedMaterials.forEach((material) => {
        console.log('MATERIAL', material)
        if (material._id == event.source.value._id) {
          this.selectedMaterials.splice(material, 1)
        }
      })
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
      this.materials.forEach((e1) => assignment.forEach((e2) => {
        if (e1.type == e2) {
          finalarray.push(e1)
        }
      }));
      this.updateData(finalarray);
    }
  }




  // MODALS
  addMaterialModal() {
    var addedMaterial = this.openDialog(AddMaterialModalComponent, { course: this.course._id }).subscribe((materials) => {
      if (materials == undefined) return;
      this.materials.push(materials);
      console.log("MATERIAL ADDED IS", materials);
      this.loading = false;
      this.openSnackBar("Material Added Successfully", "Ok");
      this.updateData(this.materials);
      if (materials.type == "Assignment") {
        this.assignmentAdded.emit({ assignmentAdded: 'Done!' })
      }
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
  }

  loadMaterialFiles(event) {
    console.log("loadMaterialFiles Called with event = ", event)
    this.selectedMaterial = event.materialId;
    console.log("Setting selectedMaterial = ", event.materialId)
    this.files = event.files;
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
}
