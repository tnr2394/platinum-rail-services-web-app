import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {ClientService} from '../../services/client.service';
import { trigger, transition, style, animate } from '@angular/animations';
@Component({
  selector: 'app-single-client',
  templateUrl: './single-client.component.html',
  styleUrls: ['./single-client.component.scss'],
  animations: [
    trigger(
      'inOutAnimation', 
      [
        transition(
          ':enter', 
          [
            style({ height: 0, opacity: 0 }),
            animate('1s ease-out', 
            style({ height: 300, opacity: 1 }))
          ]
          ),
          transition(
            ':leave', 
            [
              style({ height: 300, opacity: 1 }),
              animate('1s ease-in', 
              style({ height: 0, opacity: 0 }))
            ]
            )
          ]
          )
        ]
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
      
      deletedLocation(id){
        this.client.locations.splice(this.client.locations.findIndex(function(i){
          return i._id === id;
        }), 1);
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
    
    