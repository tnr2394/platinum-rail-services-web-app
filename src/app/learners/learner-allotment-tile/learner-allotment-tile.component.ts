import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileService } from '../../services/file.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-learner-allotment-tile',
  templateUrl: './learner-allotment-tile.component.html',
  styleUrls: ['./learner-allotment-tile.component.scss']
})
export class LearnerAllotmentTileComponent implements OnInit {
  @Input('learner') learner: any;

  constructor(public _fileService: FileService, private activatedRoute: ActivatedRoute) { }

  allotmentId;
  fileList;

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      console.log(params['id']);
      this.allotmentId = params['id'];
    });
    console.log("file tile initialized file= ", this.allotmentId);
    this.getAssignmentFileUsingAllotmentId(this.allotmentId);
  }
  getAssignmentFileUsingAllotmentId(allotmentId) {
    console.log("getAssignmentFileUsingAllotmentId= ", allotmentId);
    this._fileService.getAssignmentFileUsingAllotmentId(allotmentId).subscribe(data => {
      this.fileList = data;
      console.log(' this.fileList ======>>>>>>>>>',  this.fileList);
    })
  }

}

