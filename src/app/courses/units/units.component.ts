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
  @Input('learnersFromComponent') learnersFromComponent;
  @Input('allLearnersFromJob') allLearners;
  @Input('jobId') jobId;
  allMaterialsCopy: any;
  
  constructor(private router: Router, public _filter: FilterService) { }

  ngOnInit() {
    console.log("*****learnersFromComponent*****", this.learnersFromComponent);
    console.log("Oninit in unite=====>>>>>", this.allMaterials);
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log("*****changes in units*****", changes);
    if (changes.allMaterials && changes.allMaterials.currentValue){
      this.allMaterials = changes.allMaterials.currentValue.material
      this.allMaterialsCopy = JSON.parse(JSON.stringify(this.allMaterials))
      console.log("####this.allMaterials", this.allMaterials);
      console.log("this.allmaterialsCopy", this.allMaterialsCopy);
    }
  }
  singleMaterial(material){
    console.log("material selected is", material);
    this.router.navigate(['singleUnit'], { state: { material: material, learnersFromComponent: this.learnersFromComponent, jobId: this.jobId, courseId: this.courseId }, queryParams: { unit:material._id, course:this.courseId, job:this.jobId} })
  }
  filter(searchText){
    console.log("-----searchText-----", searchText);
    if (searchText == ' ' || searchText == null){
      this.allMaterials = this.allMaterialsCopy
    }
    else{
      let tempMaterials = this._filter.filter(searchText, this.allMaterialsCopy, ['_id'])
      this.allMaterials = tempMaterials
    }
    console.log("in filter this.allMaterialsCopy", this.allMaterialsCopy);
  }

}
