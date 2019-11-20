import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {ClientService} from '../../services/client.service';
@Component({
  selector: 'app-single-client',
  templateUrl: './single-client.component.html',
  styleUrls: ['./single-client.component.scss']
})
export class SingleClientComponent implements OnInit {
  client;
  addLocationPopup;
  loading;
  data: any;
  constructor(private activatedRoute: ActivatedRoute, private _clientService: ClientService) { 
    this.data = {
      title: ""
    }
  }

  openLocationModal(){
    this.addLocationPopup = true;
  }
  closeLocationModal(){
    this.addLocationPopup = false;
    this.loading = false;
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params=>{
      console.log(params['id']);
      this._clientService.getClient(params['id']).subscribe(data=>{ 
        console.log("RECEIVED = ",data)
        this.client = data.pop();
        console.log("THIS CLIENT LOCATIONS ARRAY = ",this.client.locations);
      });
    })    
  }


  doAddNewLocation(data){
    console.log("ADD NEW LOCATION = ",data);
    var obj = {
      client: this.client._id,
      location: data
    };
    console.log("Data to send = ",obj);
    this.loading = true;
    this._clientService.addLocation(obj).subscribe(res=>{
      console.log("Response = ",res)
      this.client.locations.push(res);
      this.closeLocationModal();
    },err=>{
      console.error(err);
    },
    ()=>{
      this.loading = false;
    });

  }

  validate(data){
    console.log("Validating ",data);
    if(!data.title) return false;

    return true;
  }
}
