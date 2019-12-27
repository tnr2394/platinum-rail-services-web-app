import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FileService } from '../../services/file.service';
import { HttpClient } from "@angular/common/http";
import * as  JSZip from 'jszip';
import * as JSZipUtil from 'jszip-utils'
import { saveAs } from "file-saver";




@Component({
  selector: 'app-learner-reading-material',
  templateUrl: './learner-reading-material.component.html',
  styleUrls: ['./learner-reading-material.component.scss']
})
export class LearnerReadingMaterialComponent implements OnInit {

  material;
  fileList = [];

  constructor(private _http: HttpClient, private activatedRoute: ActivatedRoute, private router: Router, private _fileService: FileService) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.material = this.router.getCurrentNavigation().extras.state.material;
    });
  }

  ngOnInit() {
    console.log("Materials", this.material)
    this.getMaterialFiles();
  }

  getMaterialFiles() {
    this._fileService.getFilesByMaterial(this.material._id).subscribe((files) => {
      console.log("FILES", files)
      this.fileList = files;
      console.log("this.filesList", this.fileList)
    })
  }


  downloadAll() {

    console.log('Download all clicked');

    let zip: JSZip = new JSZip();
    var count = 0;
    var zipFilename = "zipFilename.zip";
    var urls = [
      'https://platinum-rail-services.s3.eu-west-2.amazonaws.com/bharatnatyam.pdf',
      "https://static.inshorts.com/inshorts/images/v1/variants/jpg/m/2019/12_dec/26_thu/img_1577359501126_991.jpg"
    ];

    // zip.file("Hello.txt", "Hello World\n");
    // // var img = zip.folder("images");
    // // img.file("smile.gif", imgData, { base64: true });
    // zip.generateAsync({ type: "blob" })
    //   .then(function (content) {
    //     // see FileSaver.js
    //     saveAs(content, "example.zip");
    //   });


    urls.forEach(function (url) {
      var filename = "filename";
      // loading a file and add it in a zip file
      JSZipUtil.getBinaryContent(url, function (err, data) {
        if (err) {
          throw err; // or handle the error
        }
        zip.file(filename, data, { binary: true });
        count++;
        if (count == urls.length) {
          zip.generateAsync({ type: 'blob' }).then(function (content) {
            saveAs(content, zipFilename);
          });
        }
      });
    });
  }
}

