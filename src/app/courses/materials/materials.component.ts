import { Component, OnInit, ViewChild, Input } from '@angular/core';
import {CourseService} from '../../services/course.service';
import {MaterialService} from '../../services/material.service';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';

import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator, PageEvent, MatDialog } from '@angular/material';
import { AddMaterialModalComponent } from './add-material-modal/add-material-modal.component';
import { EditMaterialModalComponent } from './edit-material-modal/edit-material-modal.component';
import {FilterService} from "../../services/filter.service";
import {MatSnackBar} from '@angular/material/snack-bar';



@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss']
})
export class MaterialsComponent implements OnInit {
  // @Input('courseid') courseId: any;
  @Input('data') data: any;

  materials: any = [];
  bgColors: string[];
  lastColor;
  length;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  course;
  displayedColumns: string[] = ['title','duration','actions'];
  dataSource:  MatTableDataSource<any>;
  paginator: MatPaginator;
  sort: MatSort;
  courseId;
  @ViewChild(MatSort, {static: true}) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  @ViewChild(MatPaginator, {static: true}) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }



  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  
  constructor(public _courseService: CourseService,public _materialService: MaterialService,public dialog: MatDialog, public _filter: FilterService, public _snackBar: MatSnackBar,private activatedRoute: ActivatedRoute) {
    this.bgColors = ["badge-info","badge-success","badge-warning","badge-primary","badge-danger"]; 
    this.materials = [];
    this.dataSource = new MatTableDataSource(this.materials);
  }
  
  ngAfterViewInit() {
    console.log("AfterViewInit this.courseId = ",this.courseId);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  getRandomColorClass(i){
    var rand = Math.floor(Math.random() * this.bgColors.length);
    rand = i % 5;
    this.lastColor = rand;
    return this.bgColors[rand];
  }
  ngOnInit() {
    this.activatedRoute.params.subscribe(params=>{
      console.log(params['id']);
      this.courseId = params['id'];
      this.getMaterials(params['courseId']);
    });
    this.courseId = this.data;    
    console.log("Initialized Materials with course = ",this.courseId,{data:this.data});
    if(this.courseId){
      console.log("CourseId  ",this.courseId);
      this.getMaterials(this.courseId);
    }

    
    
  }
  
  
  // UTILITY
  
  updateData(courses){
    console.log("UPDATING DATA = ",courses)
    this.dataSource = new MatTableDataSource(courses);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log("SETTING SORT TO = ",this.dataSource.sort)
    console.log("SETTING paginator TO = ",this.dataSource.paginator)
    
  }
  
  
  
  // MODALS
  addMaterialModal(){
    var addedMaterial = this.openDialog(AddMaterialModalComponent,{course: this.course._id}).subscribe((materials)=>{
      if(materials == undefined) return;
      console.log("Material added in controller = ",materials);
      this.materials.push(materials);
      this.openSnackBar("Material Added Successfully","Ok");
      this.updateData(materials); 
    },err=>{
      return this.openSnackBar("Material could not be Added","Ok");
    });
  }
  
  
  editMaterialModal(index, data){
    this.openDialog(EditMaterialModalComponent,data).subscribe((material)=>{
      console.log("DIALOG CLOSED",material)
      // Handle Error
      if(material.result == "err") return this.openSnackBar("material could not be edited","Ok");
      
      // EDIT HANDLE
      if(material.action == 'edit'){
        console.log("HANDLING EDIT SUCCESS",material.data);
        data = material.data;
        var Index = this.materials.findIndex(function(i){
          return i._id === data._id;
        })
        this.materials[Index] = material.data;
      }
      // DELETE HANDLE
      else if(material.action == 'delete'){
        console.log("Deleted ",material);
      }
      this.updateData(this.materials);
      this.handleSnackBar({msg:"material Edited Successfully",button:"Ok"});
    });
  }
  
  deletedMaterial(event){
    console.log("Material Deleted Event : ",event);
    this.materials.splice(this.materials.findIndex(function(i){
      return i._id === event._id;
    }), 1);

  }
  
  
  handleSnackBar(data){
    this.openSnackBar(data.msg,data.button);
  }
  
  openDialog(someComponent,data = {}): Observable<any> {
    console.log("OPENDIALOG","DATA = ",data);
    const dialogRef = this.dialog.open(someComponent, {data});
    return dialogRef.afterClosed();
  }
  
  
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  
  
  
  
  // API CALLS
  
  getMaterials(courseId){
    console.log("getting materials in materials component for courseId = ",courseId)
    this._courseService.getCourse(courseId).subscribe((courses:any)=>{
      this.course = courses.pop();
      this.materials = this.course.materials;
      this.updateData(courses)
    });
  }
}
