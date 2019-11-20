import { Component, OnInit, Input } from '@angular/core';
import {ClientService} from '../../services/client.service';
@Component({
  selector: 'location-tab',
  templateUrl: './location-tab.component.html',
  styleUrls: ['./location-tab.component.scss']
})
export class LocationTabComponent implements OnInit {
  @Input('isActive') isActive: Boolean;
  @Input('location') location: any;
  editing: boolean = false;
  backupLocation;
  loading: boolean;
  constructor(private _clientService: ClientService) { }

  ngOnInit() {
    // this.location.title
    console.log("Location TAB = ",this.location);
    this.backupLocation = JSON.parse(JSON.stringify(this.location));
  }
  select(){
    alert("Selected"+this.isActive);
  }
  editLocation(){
    console.log("Enabling Editing")
    this.editing = true;
    
  }
  updateLocation(){
    this.loading = true;
    this._clientService.updateLocation(this.location).subscribe(updatedLocation=>{
      this.location = updatedLocation;
      this.loading = false;
      this.editing = false;
    },err=>{
      console.error(err);
      this.loading = false;
      alert("Location couldn't be updated. Please try again later.")
      this.location = this.backupLocation;
      this.editing = false;

    })

  }
  deleteLocation(){
    console.log("Delete ",this.location._id);
  }
}
