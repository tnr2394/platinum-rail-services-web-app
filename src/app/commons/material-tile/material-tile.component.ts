import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { MaterialService } from '../../services/material.service';
import { from } from 'rxjs';
import { AddFileModalComponent } from 'src/app/files/add-file-modal/add-file-modal.component';
import { FilterService } from 'src/app/services/filter.service';
@Component({
  selector: 'material-tile',
  templateUrl: './material-tile.component.html',
  styleUrls: ['./material-tile.component.scss']
})
export class MaterialTileComponent implements OnInit {
  @Input('material') material: any;
  @Input('isSelected') isSelected: Boolean;
  @Input('index') i : any;
  @Input('learners') learners;
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


  constructor(private _materialService: MaterialService, public _filter: FilterService) {
    this.bgColors = ["btn-info", "btn-success", "btn-warning", "btn-primary", "btn-danger"];

  }
  ngOnInit() {
    // this.material.title
    // this.DeleteMaterial.emit("Hello");
    // console.log("material TAB = ",this.material);
    if(this.material != undefined){
      this.backupMaterial = JSON.parse(JSON.stringify(this.material));
      this.type = this.material.type;
      this.title = this.material.title;
      this.materialId = this.material._id;
    }
    // console.log("INDEX", this.i);
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log("*****Changes in materials tile", changes);
    if(changes.folder != undefined){
      if(changes.folder.currentValue != undefined){
        this.type = 'folder';
        this.title = this.folder.title;
        this.files = this.folder.files;
        this.copyFiles = this.folder.files;
      }
    }
    // if(changes.learners != undefined){
    //   this.learners = changes.learners.currentValue;
    //   if (changes.learners.currentValue != undefined){
    //     if (this.material.type == "Assignment") {
    //       this.learners.forEach(learner => {
    //         if (learner.allotments.length > 0) {
    //           learner.allotments.forEach(allotment => {
    //             if (allotment.assignment._id == this.material._id) {
    //               this.allotedLearners.push(learner);
    //             }
    //           })
    //         }
    //       })
    //     }
    //   }
    //   else{
    //     console.log("changes.learners.currentValue == undefined");
        
    //   }
      console.log("***this.allocated LEarners", this.allotedLearners);
      
    // }
  }
    // this.learners.forEach(learner => {
    //   if (learner.allotments.length > 0) {
    //     // learner.allotments.ForEach
    //   }
    // })

  getRandomColorClass() {
    // let i = Math.floor(Math.random() * this.bgColors.length);
    var rand = Math.floor(Math.random() * this.bgColors.length);
    rand = this.i % 5;
    this.lastColor = rand;
    // console.log("RETURNING", this.bgColors[rand]);
    
    return this.bgColors[rand];
  }

  getMaterialFiles() {
    // this.temp = this.copyLearners;
    console.log("Getting Material ID from materialTile component", this.temp);
    if(this.material != undefined){
      this.getFiles.emit({
        materialId: this.material._id,
      });
    }
    if(this.folder != undefined){
      console.log("folder open");
      this.fileDetails(this.folder);
    }
  }
  fileDetails(event){
    this.fileDetailsComp.emit(event)
    console.log("event in material-tile", event);
  }
  applyFilter(filterValue: string) {
    console.log("filterValue", filterValue);
    
    this.files = this._filter.filter(filterValue, this.copyFiles, ['title', 'type']);
  }
  copyFiles(filterValue: string, copyFiles: any, arg2: string[]): any {
    throw new Error("Method not implemented.");
  }
  // openFileDetails() {
  //   this.fileDetailsComp.emit(event)
  // } 
  getLearners(){
    console.log("this.temp in getLearners", this.temp);
    console.log("GETTING LEARNERS FOR",this.material);
    // if(this.material.type == "Assignment"){
    //   this.learners.forEach(learner=>{
    //     if(learner.allotments.length > 0){
    //       learner.allotments.forEach(allotment=>{
    //         if(allotment._id == this.material._id){
    //           this.allotedLearners.push(learner);
    //         }
    //       })
    //     }
    //   })
    // }
    console.log("this.allotedLearners", this.allotedLearners);
  }

  editmaterial() {
    console.log("Enabling Editing")
    this.editing = true;
  }

  updateMaterial() {
    this.loading = true;
    this._materialService.editMaterial(this.material).subscribe(updatedmaterial => {
      this.material = updatedmaterial;
      this.loading = false;
      this.editing = false;
    }, err => {
      console.error(err);
      this.loading = false;
      alert("material couldn't be updated. Please try again later.")
      this.material = this.backupMaterial;
      this.editing = false;
    })

  }

  deleteMaterial() {
    this.loading = true;

    this._materialService.deleteMaterial(this.material._id).subscribe(updatedmaterial => {
      // this.material = updatedmaterial;
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

  UpateData(courses: any) {
    // throw new Error("Method not implemented.");
  }

}
