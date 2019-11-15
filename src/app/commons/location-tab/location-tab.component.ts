import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'location-tab',
  templateUrl: './location-tab.component.html',
  styleUrls: ['./location-tab.component.scss']
})
export class LocationTabComponent implements OnInit {
  @Input('isActive') isActive: Boolean;
  @Input('location') location: string;
  constructor() { }

  ngOnInit() {
  }
  select(){
    alert("Selected"+this.isActive);
  }
}
