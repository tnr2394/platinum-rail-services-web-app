import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss']
})
export class TimePickerComponent implements OnInit {

  @Input('logFor') logFor: String; //logFor = 'timeIn', 'timeOut', 'lunchStart', 'lunchEnd'
  @Input('defaultTime') defaultTime = '00:00 AM';
  @Output('timeFor') timeFor: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    console.log("logFor OnInit", this.logFor, this.defaultTime);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("logFor OnChanges", this.logFor);
  }

  timeChanged(event){
    console.log("Time changed", event);
    this.timeFor.emit({logFor: this.logFor, time:event})
  }

}
