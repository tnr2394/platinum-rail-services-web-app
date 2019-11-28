import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {MaterialService} from '../../services/material.service';
import { from } from 'rxjs';
@Component({
  selector: 'material-tile',
  templateUrl: './material-tile.component.html',
  styleUrls: ['./material-tile.component.scss']
})
export class MaterialTileComponent implements OnInit {
  @Input('material') material: any;
  @Input('isSelected') isSelected: Boolean;
  @Output() DeleteMaterial: EventEmitter<any> = new EventEmitter<any>();
  @Output() getFiles: EventEmitter<any> = new EventEmitter<any>();
  backupMaterial: any;
  isActive: string;
  editing: boolean;
  loading: boolean;
  backupmaterial: any;
  

  constructor(private _materialService: MaterialService){

  }
  ngOnInit() {
    // this.material.title
    // this.DeleteMaterial.emit("Hello");
    console.log("material TAB = ",this.material);
    this.backupMaterial = JSON.parse(JSON.stringify(this.material));
    
  }
  
  getMaterialFiles(){
    console.log("Getting Material ID from materialTile component");
    this.getFiles.emit({
      materialId: this.material._id,
      });
  }

  editmaterial(){
    console.log("Enabling Editing")
    this.editing = true;
    
  }
  updateMaterial(){
    this.loading = true;
    this._materialService.editMaterial(this.material).subscribe(updatedmaterial=>{
      this.material = updatedmaterial;
      this.loading = false;
      this.editing = false;
    },err=>{
      console.error(err);
      this.loading = false;
      alert("material couldn't be updated. Please try again later.")
      this.material = this.backupMaterial;
      this.editing = false;
      
    })
    
  }
  deleteMaterial(){ 
    this.loading = true;

    this._materialService.deleteMaterial(this.material._id).subscribe(updatedmaterial=>{
      // this.material = updatedmaterial;
      this.loading = false;
      this.editing = false;
      console.log("Deleted material. ID = ",this.material._id);
      this.DeleteMaterial.emit(this.material);
    },err=>{
      console.error(err);
      this.loading = false;
      alert("material couldn't be updated. Please try again later.")
      this.material = this.backupMaterial;
      this.editing = false;
      
    })
    
  }
  
  
  

}
