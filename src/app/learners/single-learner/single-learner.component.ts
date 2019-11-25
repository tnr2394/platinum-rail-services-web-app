import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {LearnerService} from '../../services/learner.service';
import { trigger, transition, style, animate,useAnimation, query, stagger, keyframes } from '@angular/animations';
import { bounce } from 'ng-animate';

@Component({
  selector: 'app-single-learner',
  templateUrl: './single-learner.component.html',
  styleUrls: ['./single-learner.component.scss'],
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

export class SingleLearnerComponent implements OnInit {
  learner;
  loading;
  data: any;
  constructor(private activatedRoute: ActivatedRoute, private _learnerService: LearnerService) { 
    this.data = {
      title: ""
    }
  }
  
  
  ngOnInit() {
    this.activatedRoute.params.subscribe(params=>{
      console.log(params['id']);
      this._learnerService.getLearner(params['id']).subscribe(data=>{ 
        console.log("RECEIVED = ",data)
        this.learner = data.pop();
        console.log("THIS CLIENT LOCATIONS ARRAY = ",this.learner);
      });
    })    
  }
  
  validate(data){
    console.log("Validating ",data);
    if(!data.title) return false;
    
    return true;
  }
}

