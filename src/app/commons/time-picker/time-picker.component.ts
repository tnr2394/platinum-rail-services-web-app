import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss']
})
export class TimePickerComponent implements OnInit {

  @Input('logFor') logFor: String; //logFor = 'timeIn', 'timeOut', 'lunchStart', 'lunchEnd'
  @Input('defaultTime') defaultTime;
  @Input('min') minimunTime;
  @Output('timeFor') timeFor: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    console.log("logFor OnInit", this.logFor, this.defaultTime);
    // if (this.defaultTime == "0:0") this.defaultTime = ""
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("logFor OnChanges", this.logFor);
    if (this.minimunTime) this.minimunTime = this.minimunTime.split(":")[0] + ":" + this.minimunTime.split(":")[1]
    // if (this.logFor == "lunchEnd") this.minimunTime = "13:15"
    console.log("minTime", this.minimunTime);
  }

  timeChanged(event){
    console.log("Time changed", event);
    this.timeFor.emit({logFor: this.logFor, time:event})
  }

}
