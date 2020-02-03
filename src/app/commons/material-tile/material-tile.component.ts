import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { MaterialService } from '../../services/material.service';
import { from, Observable } from 'rxjs';
import { AddFileModalComponent } from 'src/app/files/add-file-modal/add-file-modal.component';
import { FilterService } from 'src/app/services/filter.service';
import { JobService } from 'src/app/services/job.service';
import { LearnerService } from 'src/app/services/learner.service';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { CreateFolderModalComponent } from 'src/app/folder/create-folder-modal/create-folder-modal.component';
import { AddMaterialModalComponent } from 'src/app/courses/materials/add-material-modal/add-material-modal.component';
import { DeleteConfirmModalComponent } from '../delete-confirm-modal/delete-confirm-modal.component';
@Component({
  selector: 'material-tile',
  templateUrl: './material-tile.component.html',
  styleUrls: ['./material-tile.component.scss']
})
export class MaterialTileComponent implements OnInit {
  @Input('material') material: any;
  @Input('isSelected') isSelected: Boolean;
  @Input('index') i : any;
  @Input('jobId') jobId;
  @Input('folder') folder: any;
  @Output() DeleteMaterial: EventEmitter<any> = new EventEmitter<any>();
  @Output() getFiles: EventEmitter<any> = new EventEmitter<any>();
  @Output() fileDetailsComp: EventEmitter<any> = new EventEmitter<any>();
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
  type: 'folder';
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
  allLearners: any;
  unassignedLearners: number;
  learnerNames = [];
  displayLearners: Boolean = false;
  displaySubFolders: boolean = false;

  constructor(private _materialService: MaterialService, private _learnerService: LearnerService, public dialog: MatDialog, 
    public _snackBar: MatSnackBar, public router: Router, public _filter: FilterService) {
    this.bgColors = ["btn-info", "btn-success", "btn-warning", "btn-primary", "btn-danger"];

  }
  ngOnInit() {
    
    if (this.router.url.includes('/jobs')){
      this.displayLearners = true
      this.getLearners()
      this.assignmentStatusWithLearner(this.jobId)
    }
    if(this.material != undefined){
      this.backupMaterial = JSON.parse(JSON.stringify(this.material));
      this.type = this.material.type;
      this.title = this.material.title;
      this.materialId = this.material._id;
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log("*****Changes in materials tile", changes);
    if(changes.folder != undefined){
      if(changes.folder.currentValue != undefined){
        this.type = 'folder';
        this.title = this.folder.title;
        this.files = this.folder.files;
        this.copyFiles = this.folder.files;
        this.displaySubFolders = true;
      }
    }
    if(this.displayLearners == true){
      if (changes.jobId != undefined) {
        if (changes.jobId.currentValue != undefined) {
          this.assignmentStatusWithLearner(this.jobId);
          this.getLearners()
        }
      }
    }

    if(changes.material != undefined){
      if (changes.material.currentValue != undefined){
        this.materialId = changes.material.currentValue.material_id;
        this.assignedLearner = 0
        this.pendingLearners = 0
        this.resubmissionLearners = 0
        this.submittedLearners = 0
        this.completedLearners = 0
      }
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
    console.log("INDEX IS", this.i);
    
    // this.temp = this.copyLearners;
    console.log("Getting Material ID from materialTile component", this.temp);
    if(this.material != undefined){
      this.getFiles.emit({
        materialId: this.material._id,
      });
      if(this.learner != undefined){
        this.getCount()
      }
    }
    if(this.folder != undefined){
      console.log("folder open");
      this.fileDetails(this.folder);
    }
  }
  fileDetails(event){
    event.materialIndex = this.i
    this.fileDetailsComp.emit(event)
    console.log("event in material-tile", event);
  }
  closeFileDetails(){
    console.log("Expansion closed^");
  }
  applyFilter(filterValue: string) {
    console.log("filterValue", filterValue);
    
    this.files = this._filter.filter(filterValue, this.copyFiles, ['title', 'type']);
  }
  copyFiles(filterValue: string, copyFiles: any, arg2: string[]): any {
    throw new Error("Method not implemented.");
  }
  openDialog(someComponent, data = {}): Observable<any> {
    console.log("OPENDIALOG", "DATA = ", data);
    const dialogRef = this.dialog.open(someComponent, { data, width: '500px', height: '600px' });
    return dialogRef.afterClosed();
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  editmaterial() {
    this.openDialog(AddMaterialModalComponent, {material:this.material}).subscribe(material=>{
      if(material == undefined) return
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
    this.openDialog(DeleteConfirmModalComponent, "Material").subscribe(confirm=>{
      // if(confirm != undefined) return
      if(confirm == 'yes'){
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
    console.log("currentFolder", this.folder);
    this.openDialog(CreateFolderModalComponent, this.folder).subscribe(folder => {
      if (folder == undefined) return
      console.log("FOLDER NAME RECIEVED", folder);

      // this.allFolders.push(folder);
    },error => {
      console.log("ERROE$$$");
      
    })
  }
  subFolder(){
    console.log("SUB FOLDER CLICKED");
  }
// GET LEARNER COUNT
  getCount(){
    this.assignedLearner = 0
    this.pendingLearners = 0
    this.resubmissionLearners = 0
    this.submittedLearners = 0
    this.completedLearners = 0
    this.learner.forEach(learner=>{
      learner.assignments.forEach(assignment=>{
        if (assignment.assignmentId == this.materialId ){
          this.learnerNames.push(learner.learnerName)
          this.assignedLearner += 1;
          if(assignment.assignmentStatus == 'Pending'){
            this.pendingLearners += 1
          }
          else if (assignment.assignmentStatus == 'Requested for Resubmission'){
            this.resubmissionLearners += 1
          }
          else if (assignment.assignmentStatus == 'Submitted') {
            this.submittedLearners += 1
          }
          else if (assignment.assignmentStatus == 'Completed'){
            this.completedLearners += 1
          }
        }

        console.group(" Chek Counts with type ")


        console.log(this.allLearners, typeof this.allLearners, "this.allLearners")
        console.log(this.assignedLearner, typeof this.assignedLearner, "this.assignedLearner")

        this.unassignedLearners = this.allLearners - this.assignedLearner;
        console.log(this.unassignedLearners, typeof this.unassignedLearners, "this.unassignedLearners")
        console.groupEnd()

      })
    })
    console.log("-----this.assignedLearner", this.assignedLearner);
    console.log("-----this.pendingLearners", this.pendingLearners);
    console.log("-----this.resubmissionLearners", this.resubmissionLearners);
    console.log("-----this.submittedLearners", this.submittedLearners);
    console.log("-----this.completedLearners", this.completedLearners);
  }



  // API
  getLearners() {
    this._learnerService.getLearnersByJobId(this.jobId).subscribe(allLearners => {
      this.allLearners = allLearners.length;
    })
  }

  assignmentStatusWithLearner(jobId) {
    this._materialService.assignmentStatusWithLearner(jobId).subscribe((data) => {
      this.learner = data;
      this.learnerLength = data.length;
      console.log('Learner List:::::::::::::::::::::::', data);
    });
  }
}
