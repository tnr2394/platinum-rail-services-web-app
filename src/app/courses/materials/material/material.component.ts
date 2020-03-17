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

  @Output() fileDetailComp: EventEmitter<any> = new EventEmitter<any>();
  @Output() assignmentAdded = new EventEmitter<any>();
  @Output() getMaterialsFromComponent: EventEmitter<any> = new EventEmitter<any>();
  constructor(public _materialService: MaterialService, private activatedRoute: ActivatedRoute,
    public dialog: MatDialog, public _snackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.loading = true
    console.log("this.type", this.type);
    console.log("this.material", this.material);
    this.updateData(this.material)
    this.activatedRoute.params.subscribe(params => {
      this.courseId = params['courseId']
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

}
