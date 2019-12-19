import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-learner-allotment-tile',
  templateUrl: './learner-allotment-tile.component.html',
  styleUrls: ['./learner-allotment-tile.component.scss']
})
export class LearnerAllotmentTileComponent implements OnInit {

  @Input('learner') learner: any;

  constructor() { }

  ngOnInit() {
    console.log("file tile initialized file= ", this.learner);
  }

}

