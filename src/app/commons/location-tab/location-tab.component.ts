import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'location-tab',
  templateUrl: './location-tab.component.html',
  styleUrls: ['./location-tab.component.scss']
})
export class LocationTabComponent implements OnInit {
  @Input('isActive') isActive: Boolean;
  @Input('location') location: any;
  editing: boolean;
  constructor() { }

  ngOnInit() {
    // this.location.title
    console.log("Location TAB = ",this.location)  
  }
  select(){
    alert("Selected"+this.isActive);
  }
  editLocation(){
    this.editing = true;
    
  }
  deleteLocation(){
    console.log("Delete ",this.location._id);
  }
}
