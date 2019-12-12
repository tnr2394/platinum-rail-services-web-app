import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileService } from 'src/app/services/file.service';
import { from } from 'rxjs';
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

  constructor(public _fileService: FileService) {

  }


  ngOnInit() {
    console.log("file tile initialized file= ", this.file);
  }


  delete() {
    console.warn("DELETING ", this.file._id);
    this._fileService.deleteFiles(this.file._id).subscribe(file => {
      console.log("Deleted File. ID = ", this.file._id);
      this.loading = false;
      this.deletedFile.emit(this.file._id);
    }, err => {
      alert("Error deleting file.")
    });

  }

}
