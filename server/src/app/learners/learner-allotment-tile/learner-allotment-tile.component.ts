import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileService } from '../../services/file.service';
import { ActivatedRoute, Router } from '@angular/router';

import * as  JSZip from 'jszip';
import * as JSZipUtil from 'jszip-utils'
import { saveAs } from "file-saver";
import * as _ from 'lodash';



@Component({
  selector: 'app-learner-allotment-tile',
  templateUrl: './learner-allotment-tile.component.html',
  styleUrls: ['./learner-allotment-tile.component.scss']
})
export class LearnerAllotmentTileComponent implements OnInit {
  @Input('learner') learner: any;

  assignment;
  loadingAssignments:Boolean;
  loading: boolean = false;

  constructor(public _fileService: FileService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.assignment = this.router.getCurrentNavigation().extras.state.assignment;
    });
  }

  allotmentId;
  fileList = [];

  ngOnInit() {
    this.loadingAssignments = true;
    console.log("this.assignment", this.assignment)
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
      this.loadingAssignments = false
      console.log(' this.fileList ======>>>>>>>>>', this.fileList);
    })
  }

  downloadAll() {

    console.log('Download all clicked');

    this.loading = true;

    let zip: JSZip = new JSZip();
    let count = 0;
    var zipFilename = this.assignment.assignment.title + '.zip';


    _.forEach(this.fileList, (file) => {
      var filename = file.path.split("/")[3];
      // loading a file and add it in a zip file
      JSZipUtil.getBinaryContent(file.path, (err, data) => {
        if (err) {
          throw err; // or handle the error
        }
        zip.file(filename, data, { binary: true });
        count++;

        if (count == this.fileList.length) {
          zip.generateAsync({ type: 'blob' }).then(function (content) {
            saveAs(content, zipFilename);
          });
          this.loading = false;
        }
      });
    });
  }
}
