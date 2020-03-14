import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-single-unit',
  templateUrl: './single-unit.component.html',
  styleUrls: ['./single-unit.component.scss']
})
export class SingleUnitComponent implements OnInit {
  allMaterials: any;
  selectedMaterial: any;
  files: any;
  @Output() openFilesSideNav: EventEmitter<any> = new EventEmitter<any>();
  constructor(private route: ActivatedRoute, private router: Router) {
    this.allMaterials = this.router.getCurrentNavigation().extras.state.material;
   }

  ngOnInit() {
    console.log("this.allMaterials are ---------", this.allMaterials);
  }
  loadMaterialFiles(event) {
    console.log("loadMaterialFiles Called with event = ", event)
    this.selectedMaterial = event.materialId;
    console.log("Setting selectedMaterial = ", event.materialId)
    this.files = event.files;
  }
  fileDetailsComp(event) {
    console.log("fileDetailsComp", event);
    this.openFilesSideNav.emit({ event })
    // this.materialIndex = event.materialIndex
    // this.file = event.file;
    // this.mydsidenav.open();
    // console.log("EVENT OPENING", event.file);
  }

}
