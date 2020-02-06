import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FileService } from '../../services/file.service';
import { HttpClient } from "@angular/common/http";
import * as  JSZip from 'jszip';
import * as JSZipUtil from 'jszip-utils'
import { saveAs } from "file-saver";
import * as _ from 'lodash';




@Component({
  selector: 'app-learner-reading-material',
  templateUrl: './learner-reading-material.component.html',
  styleUrls: ['./learner-reading-material.component.scss']
})
export class LearnerReadingMaterialComponent implements OnInit {

  material;
  loadingMaterials:Boolean;
  fileList = [];
  fileListLength;
  loading: boolean = false;
  disableDownloadBtn: boolean;


  constructor(private _http: HttpClient, private activatedRoute: ActivatedRoute, private router: Router, private _fileService: FileService) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.material = this.router.getCurrentNavigation().extras.state.material;
    });
  }

  ngOnInit() {
    this.loadingMaterials = true;
    console.log("Materials", this.material)
    this.getMaterialFiles();
  }

  getMaterialFiles() {
    this._fileService.getFilesByMaterial(this.material._id).subscribe((files) => {
      console.log("FILES", files)
      this.fileList = files;
      this.loadingMaterials = false;
      console.log("this.filesList", this.fileList)
      this.fileListLength = this.fileList.length;
      this.disableDownloadBtn = this.fileListLength > 0 ? false : true; 
      console.log('File List Length:', this.fileListLength);
    })
  }


  downloadAll() {

    console.log('Download all clicked');

    this.loading = true;


    let zip: JSZip = new JSZip();
    let count = 0;
    var zipFilename = this.material.title + '.zip';


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

