import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-file-details',
  templateUrl: './file-details.component.html',
  styleUrls: ['./file-details.component.scss']
})
export class FileDetailsComponent implements OnInit {
  @Input('details') recievedFile;
  createdAt: any;
  totalFiles: any;
  lastUpdate: any;
  title: any;
  displaySaveBtn: boolean = false;
  id: any;
  constructor() { }

  ngOnInit() {
    console.log(this.recievedFile)
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.displaySaveBtn = false
    console.log("CHANGES",changes);
    this.createdAt = changes.recievedFile.currentValue.createdAt;
    this.totalFiles = changes.recievedFile.currentValue.files.length;
    this.lastUpdate = changes.recievedFile.currentValue.updatedAt;
    this.title = changes.recievedFile.currentValue.title;
    this.id = changes.recievedFile.currentValue._id;
  }
  showSaveBtn(){
    this.displaySaveBtn = true;
  }
  saveFolder(){
    let update = {
      title: this.title,
      id : this.id
    }
    console.log("UPDATE", update);
    
    // API CALL PENDING FOR SAVING CHANGED FOLDER TITLE
  }
}
