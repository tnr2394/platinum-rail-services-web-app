import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-file-details',
  templateUrl: './file-details.component.html',
  styleUrls: ['./file-details.component.scss']
})
export class FileDetailsComponent implements OnInit {
  @Input('details') recievedFile;
  constructor() { }

  ngOnInit() {
    console.log(this.recievedFile)
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log("CHANGES",changes);
    
  }

}
