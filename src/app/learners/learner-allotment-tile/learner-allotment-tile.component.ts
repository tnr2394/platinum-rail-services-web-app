import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-learner-allotment-tile',
  templateUrl: './learner-allotment-tile.component.html',
  styleUrls: ['./learner-allotment-tile.component.scss']
})
export class LearnerAllotmentTileComponent implements OnInit {

  @Input('learner') learner: any;

  constructor(public _fileService: FileService) { }

  ngOnInit() {
    console.log("file tile initialized file= ");
  }

  // getFiles(){
    // this._fileService.getFilesByMaterial()
  // }

}

