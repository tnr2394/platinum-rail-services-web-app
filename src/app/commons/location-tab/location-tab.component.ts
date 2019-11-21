import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {ClientService} from '../../services/client.service';
import { trigger, transition, query, animateChild, state, style, animate, useAnimation } from '@angular/animations';
import {bounce} from 'ng-animate';


export const FLIP_TRANSITION = [ 
  trigger(
    'inOutAnimation', 
    [
      transition(
        ':enter', 
        [
          style({ opacity: 0 }),
          animate('0.5s ease-in-out', 
          style({  opacity: 1 }))
        ]
        ),
        transition(
          ':leave', 
          [
            style({  opacity: 1 }),
            animate('0s ease-in', 
            style({  opacity: 0 }))
          ]
          )
        ]
        ),
        trigger('bounce', [transition('* => *', useAnimation(bounce))]),


      ];
      
      
      @Component({
        selector: 'location-tab',
        templateUrl: './location-tab.component.html',
        styleUrls: ['./location-tab.component.scss'],
        animations:[FLIP_TRANSITION]
      })
      export class LocationTabComponent implements OnInit {
        @Input('isActive') isActive: Boolean;
        @Input('location') location: any;
        @Output() onDeleted: EventEmitter<any> = new EventEmitter<any>();
        
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
          this.loading = true;
          this._clientService.deleteLocation(this.location._id).subscribe(updatedLocation=>{
            // this.location = updatedLocation;
            this.loading = false;
            this.editing = false;
            this.onDeleted.emit(this.location._id);
          },err=>{
            console.error(err);
            this.loading = false;
            alert("Location couldn't be updated. Please try again later.")
            this.location = this.backupLocation;
            this.editing = false;
            
          })
          
        }
        
        
      }
      
      