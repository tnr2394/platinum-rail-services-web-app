import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileService } from 'src/app/services/file.service';
import { from } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router'
@Component({
  selector: 'file-tile',
  templateUrl: './file-tile.component.html',
  styleUrls: ['./file-tile.component.scss']
})
export class FileTileComponent implements OnInit {




  @Input('file') file: any;
  @Output() deletedFile: EventEmitter<any> = new EventEmitter<any>();
  @Output() getFiles: EventEmitter<any> = new EventEmitter<any>();
  loading: boolean;

  isSubmission;

  constructor(public _fileService: FileService, private route: ActivatedRoute, public router: Router) {
    if (this.router.url.includes('submission') || this.router.url.includes('allotment')) {
      this.isSubmission = true;
    } else {
      this.isSubmission = false;
    }
  }


  ngOnInit() {
    console.log("file tile initialized file= ", this.file);

    console.log(' this.isSubmission', this.isSubmission);
  }


  delete() {
    console.warn("DELETING ", this.file._id);

    if (this.isSubmission) {
      this._fileService.deleteSubmissionFiles(this.file._id).subscribe(file => {
        console.log("Deleted File. ID = ", this.file._id);
        this.loading = false;
        this.deletedFile.emit(this.file._id);
      }, err => {
        alert("Error deleting file.")
      });

    } else {
      this._fileService.deleteFiles(this.file._id).subscribe(file => {
        console.log("Deleted File. ID = ", this.file._id);
        this.loading = false;
        this.deletedFile.emit(this.file._id);
      }, err => {
        alert("Error deleting file.")
      });
    }
  }

}
