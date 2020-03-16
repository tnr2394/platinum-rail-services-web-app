import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterService } from 'src/app/services/filter.service';
import { SearchPipe } from 'src/app/search.pipe';
import * as _ from 'lodash';
import { CourseService } from 'src/app/services/course.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AddMaterialModalComponent } from '../materials/add-material-modal/add-material-modal.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-single-unit',
  templateUrl: './single-unit.component.html',
  styleUrls: ['./single-unit.component.scss'],
  providers: [SearchPipe]
})
export class SingleUnitComponent implements OnInit {
  allMaterials: any;
  allMaterialsCopy:any;
  selectedMaterial: any;
  files: any;
  @Output() openFilesSideNav: EventEmitter<any> = new EventEmitter<any>();
  unitNo: any;
  courseId: any;
  groupedMaterials: any;
  constructor(private activatedRoute: ActivatedRoute, private router: Router, public _filter: FilterService, 
    public _courseService: CourseService,
    public dialog: MatDialog, public _snackBar: MatSnackBar) {
    if (this.router.getCurrentNavigation().extras.state){
      this.allMaterials = this.router.getCurrentNavigation().extras.state.material;
    }
    else{
      console.log("---No STATE---");
    }
   }

  ngOnInit() {
    if (this.allMaterials){
      this.allMaterialsCopy = JSON.parse(JSON.stringify(this.allMaterials)) 
    }
    else{
      this.activatedRoute.params.subscribe(params => {
        this.unitNo = params['unitno']
        console.log("params", params);
        this.courseId = params['courseId']
        this.getGroupedMaterials(params['courseId'])
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
    if (searchText == ' ' || searchText == null ) {
      this.allMaterials = this.allMaterialsCopy
    }
    else {
      let tempAssignments = _.filter(this.allMaterialsCopy.materialsAssignment, function(o) {
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
      if (groupedmaterial.material.length > 0){
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
      else{
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
