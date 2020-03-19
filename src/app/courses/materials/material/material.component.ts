import { Component, OnInit, Input, SimpleChanges, ViewChild, Output, EventEmitter } from '@angular/core';
import { MaterialService } from '../../../services/material.service'
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { AddMaterialModalComponent } from '../add-material-modal/add-material-modal.component';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
@Component({
  selector: 'single-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss']
})
export class MaterialComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  paginator: MatPaginator;
  sort: MatSort;
  displayedColumns: string[] = ['Materials'];
  selectedMaterial: any;
  files: any;
  loading: boolean;
  courseId: any;
  selectedMaterials = [];
  view: Boolean = false;
  selectedCheckbox;
  showLearnerTab;
  learnerToPass: any;
  testStatus: boolean = false
  unitNo: any;
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

  @Input('material') material: any;
  @Input('type') type: any;
  @Input('clearCheckBox') clearCheckBox;
  @Input('allLearnersFromJob') allLearners;
  @Input('learnerWithStatus') learnerWithStatus;
  @Input('displayLearners') displayLearners;

  @Output() fileDetailComp: EventEmitter<any> = new EventEmitter<any>();
  @Output() assignmentAdded = new EventEmitter<any>();
  @Output() getMaterialsFromComponent: EventEmitter<any> = new EventEmitter<any>();
  @Output() assignmentAllocated: EventEmitter<any> = new EventEmitter<any>();
  constructor(public _materialService: MaterialService, private activatedRoute: ActivatedRoute,
    public dialog: MatDialog, public _snackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.loading = true
    console.log("this.type", this.type);
    console.log("this.material", this.material);
    this.updateData(this.material)
    this.activatedRoute.queryParams.subscribe(params => {
      this.courseId = params['course']
      this.unitNo = params['unit']
      console.log("params", params);
      // this.courseId = params['courseId']
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("changes in material component", changes);
    if (changes.material && changes.material.currentValue) {
      // this.loading = true
      this.material = changes.material.currentValue
      this.updateData(this.material)
    }
    if (changes.type && changes.type.currentValue) {
      this.type = changes.type.currentValue
      if (this.type == 'Assignment') this.showLearnerTab = true
      else this.showLearnerTab = false
    }
    if (changes.clearCheckBox && changes.clearCheckBox.currentValue) {
      this.selectedCheckbox = false
      this.clearCheckBox = false
    }
    if (changes.learnerWithStatus && changes.learnerWithStatus.currentValue) {
      console.log("changes.learnerWithStatus.currentValue", changes.learnerWithStatus.currentValue);
      this.learnerToPass = changes.learnerWithStatus.currentValue
      this.testStatus = true 
    }
    if (changes.allLearners && changes.allLearners.currentValue){
      this.allLearners = changes.allLearners.currentValue 
      console.log("changes.allLearners.currentValue", this.allLearners);
    }
    if (changes.displayLearners && changes.displayLearners.currentValue){
      this.displayLearners = changes.displayLearners.currentValue
    }



      console.log("value assigned", this.learnerToPass);

  }
  changeStatus(data) {
    this.learnerToPass = data
    console.log("data================", this.learnerToPass)
  }


  updateData(updateData) {
    this.loading = false
    console.log("UPDATING DATA Called = ", updateData);
    // this.getMaterialsFromComponent.emit({ materials: this.selectedMaterials })
    this.dataSource = new MatTableDataSource(updateData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    console.log("SETTING SORT TO = ", this.dataSource.sort)
    console.log("SETTING paginator TO = ", this.dataSource.paginator)
  }
  loadMaterialFiles(event) {
    console.log("loadMaterialFiles Called with event = ", event)
    this.selectedMaterial = event.materialId;
    console.log("Setting selectedMaterial = ", event.materialId)
    this.files = event.files;
  }
  fileDetailsComp(event) {
    console.log("fileDetailsComp =====>>>>>", event);
    this.fileDetailComp.emit({ event });
    // this.materialIndex = event.materialIndex
    // this.file = event.file;
    // this.mydsidenav.open();
    // console.log("EVENT OPENING", event.file);
  }
  deletedMaterial(event) {
    console.log("Material Deleted Event : ", event);
    this.material.splice(this.material.findIndex(function (i) {
      return i._id === event._id;
    }), 1);
    console.log("material deleted", this.material);
    this.updateData(this.material)
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

  addMaterialModal() {
    let data = {
      course: this.courseId,
      unitNo: this.unitNo,
      type: this.type
    }
    var addedMaterial = this.openDialog(AddMaterialModalComponent, { data }).subscribe((materials) => {
      console.log("*****materials*****", materials);
      if (materials == undefined) return;
      this.material.push(materials)
      this.updateData(this.material)
      // var index = _.findIndex(this.groupedMaterials, function (o) {
      //   console.log("o._id", o._id, "materials.unitNo", materials.unitNo);
      //   return o._id == materials.unitNo
      // })
      // console.log("index is ", index);
      // if (index > -1) {
      //   console.log("in if");
      //   if (materials.type == 'Reading') {
      //     console.log("materials.type===>>>", materials.type);
      //     this.groupedMaterials[index].materialsReading.push(materials)
      //   }
      //   else {
      //     console.log("materials.type===>>>", materials.type);
      //     this.groupedMaterials[index].materialsAssignment.push(materials)
      //   }
      //   this.allMaterials = this.groupedMaterials[index]
      //   console.log("this.allMaterials issss", this.allMaterials);
      //   this.allMaterialsCopy = JSON.parse(JSON.stringify(this.allMaterials))
      // }
      // else {
      //   let data = {
      //     _id: materials.unitNo,
      //     materialsReading: [],
      //     materialsAssignment: []
      //   }
      //   if (materials.type == 'Reading') {
      //     data.materialsReading.push(materials)
      //   }
      //   else data.materialsAssignment.push(materials)
      //   this.groupedMaterials.push(data)
      // }
    }, err => {
      return this.openSnackBar("Material could not be Added", "Ok");
    });
  }
  allocatedFromTile(event) {
    console.log("In material", event);
    this.assignmentAllocated.emit({ msg: "assignment allocated from material tile" })
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
}
