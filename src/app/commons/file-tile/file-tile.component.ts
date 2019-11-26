import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'file-tile',
  templateUrl: './file-tile.component.html',
  styleUrls: ['./file-tile.component.scss']
})
export class FileTileComponent implements OnInit {

  @Input('file') file: any;
  constructor() { }

  ngOnInit() {
    console.log("file tile initialized file= ",this.file);
  }

}
