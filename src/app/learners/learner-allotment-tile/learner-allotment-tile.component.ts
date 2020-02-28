import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileService } from '../../services/file.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LearnerService } from '../../services/learner.service';

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
  loadingAssignments: Boolean;
  assignmentDetail;
  loading: boolean = false;

  fileExtensionArray = ['ppt', 'zip', 'pptx', 'mp4', 'xls', 'xlsx', 'txt', 'odt', 'png', 'jpg', 'jpeg', 'pdf', 'doc', 'docx'];

  constructor(public _learnerService: LearnerService, public _fileService: FileService, private activatedRoute: ActivatedRoute, private router: Router) {
  }

  allotmentId;
  fileList = [];
  disable;

  ngOnInit() {
    this.loadingAssignments = true;
    console.log("this.assignment", this.assignment)
    this.activatedRoute.params.subscribe(params => {
      console.log(params['id']);
      this.allotmentId = params['id'];
    });
    console.log("file tile initialized file= ", this.allotmentId);
    this.getAssignmentFileUsingAllotmentId(this.allotmentId);
    this.getAllotments(this.allotmentId);
  }

  getAllotments(allotmentId) {
    console.log('Get Allotments Called', allotmentId);
    this._learnerService.getAllotedLearnerFilesUsingAllotmentId(allotmentId).subscribe(data => {
      console.log("RECEIVED Allotment = ", data[0])
      this.assignmentDetail = data[0];
    });
  }


  getAssignmentFileUsingAllotmentId(allotmentId) {
    console.log("getAssignmentFileUsingAllotmentId= ", allotmentId);
    this._fileService.getAssignmentFileUsingAllotmentId(allotmentId).subscribe(data => {
      this.fileList = data;
      if (this.fileList.length < 1) {
        this.disable = true
      }
      else this.disable = false
      this.loadingAssignments = false
    })
  }

  FileExtension(extension) {
    let index = _.findIndex(this.fileExtensionArray, function (o) { return o == extension; });
    if (index >= 0) {
      return this.fileExtensionArray[index];
    } else {
      return 'default-extension';
    }
  }

  downloadAll() {
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

