import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import {ClientService} from '../../services/client.service';
import { trigger, transition, style, animate,useAnimation, query, stagger, keyframes } from '@angular/animations';
import { bounce } from 'ng-animate';
import { AddLocationComponent } from './add-location/add-location.component';
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
          ),
          trigger('bounce', [transition('* => *', useAnimation(bounce))]),
          trigger('listAnimation', [
            transition('* => *', [ // each time the binding value changes
              query(':leave', [
                stagger(100, [
                  animate('0.5s', style({ opacity: 0 }))
                ])
              ], {optional: true}),
              query(':enter', [
                // style({ opacity: 0 }),
                stagger(100, [
                  
                  animate('1s ease-in', keyframes([
                    style({opacity: 0, transform: 'translateY(-75%)', offset: 0}),
                    style({opacity: .5, transform: 'translateY(35px)',  offset: 0.3}),
                    style({opacity: 1, transform: 'translateY(0)',     offset: 1.0}),
                  ]))
              ])
            ])
          ])
        ])
      ]
    })
    export class SingleClientComponent implements OnInit {
      client;
      addLocationPopup;
      loading;
      data: any;
  constructor(private activatedRoute: ActivatedRoute, private _clientService: ClientService, public dialog: MatDialog) { 
        this.data = {
          title: ""
        }
      }
      
      // openLocationModal(){
      //   this.addLocationPopup = true;
      // }
      // closeLocationModal(){
      //   this.addLocationPopup = false;
      //   this.loading = false;
      // }
      
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
    openDialog(someComponent, data = {}): Observable<any> {
      console.log("OPENDIALOG", "DATA = ", data);
      const dialogRef = this.dialog.open(someComponent, { data, width: '500px', height: '600px' });
      return dialogRef.afterClosed();
    }
    addLocationModal(){
      var addLocation = this.openDialog(AddLocationComponent).subscribe((location)=>{
        console.log("Added location", location)
        if(location == undefined) return;
        if (location.title == ""){
          return;
        }
        else{
        var obj = {
          client: this.client._id,
          location: location
        };
        console.log("Data to send = ", obj);
        this.loading = true;
        this._clientService.addLocation(obj).subscribe(res=>{
          console.log("Response = ",res)
          this.client.locations.push(res);  
        },err=>{
          console.error(err);
        },
        ()=>{
          this.loading = false;
        });
      }
      })
    }
      
      deletedLocation(id){
        this.client.locations.splice(this.client.locations.findIndex(function(i){
          return i._id === id;
        }), 1);
      }
      // doAddNewLocation(data){
      //   console.log("ADD NEW LOCATION = ",data);
      //   var obj = {
      //     client: this.client._id,
      //     location: data
      //   };
      //   console.log("Data to send = ",obj);
      //   this.loading = true;
      //   this._clientService.addLocation(obj).subscribe(res=>{
      //     console.log("Response = ",res)
      //     this.client.locations.push(res);
      //     this.closeLocationModal();
      //   },err=>{
      //     console.error(err);
      //   },
      //   ()=>{
      //     this.loading = false;
      //   });
        
      // }
      
      validate(data){
        console.log("Validating ",data);
        if(!data.title) return false;
        
        return true;
      }
    }
    
    