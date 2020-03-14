import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss']
})
export class UnitsComponent implements OnInit {

  searchText


  @Input('groupedMaterilas') allMaterials;
  constructor(private router: Router) { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.allMaterials && changes.allMaterials.currentValue){
      this.allMaterials = changes.allMaterials.currentValue.material
      console.log("####this.allMaterials", this.allMaterials);
    }
  }
  singleMaterial(material){
    console.log("material selected is", material);
    this.router.navigate(['singleUnit',material.unitNo], { state: { material: material } })
  }
  filter(searchText){
    
  }

}
