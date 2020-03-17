import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { FilterService } from 'src/app/services/filter.service';
import { SearchPipe } from '../../../app/search.pipe';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss'],
  
})
export class UnitsComponent implements OnInit {

  searchText

  @Input('groupedMaterilas') allMaterials;
  @Input('courseId') courseId;
  allMaterialsCopy: any;
  
  constructor(private router: Router, public _filter: FilterService) { }

  ngOnInit() {
    console.log("Oninit in unite=====>>>>>", this.allMaterials);
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log("changes in units=====>>>>>", changes);
    if (changes.allMaterials && changes.allMaterials.currentValue){
      this.allMaterials = changes.allMaterials.currentValue.material
      this.allMaterialsCopy = this.allMaterials
      console.log("####this.allMaterials", this.allMaterials);
    }
  }
  singleMaterial(material){
    console.log("material selected is", this.courseId);
    this.router.navigate(['singleUnit', material._id,this.courseId], { state: { material: material } })
  }
  filter(searchText){
    console.log("-----searchText-----", searchText);
    if (searchText == ''){
      this.allMaterials = this.allMaterialsCopy
    }
    else{
      let tempMaterials = this._filter.filter(searchText, this.allMaterialsCopy, ['_id'])
      this.allMaterials = tempMaterials
    }
  }

}
