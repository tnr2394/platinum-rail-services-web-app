import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { FileService } from '../../services/file.service'

@Component({
  selector: 'app-learner-reading-material',
  templateUrl: './learner-reading-material.component.html',
  styleUrls: ['./learner-reading-material.component.scss']
})
export class LearnerReadingMaterialComponent implements OnInit {

  material;
  fileList = [];
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private _fileService: FileService) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.material = this.router.getCurrentNavigation().extras.state.material;
    });
   }

  ngOnInit() {
    console.log("Materials", this.material)
    this.getMaterialFiles();
  }

  getMaterialFiles() {
    this._fileService.getFilesByMaterial(this.material._id).subscribe((files)=>{
      console.log("FILES", files)
      this.fileList = files;
      console.log("this.filesList", this.fileList)
    })
  }

}
