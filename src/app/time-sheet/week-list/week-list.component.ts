import { Component, OnInit } from '@angular/core';
import { SlideInOutAnimation } from './animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as moment from 'moment';



@Component({
  selector: 'app-week-list',
  templateUrl: './week-list.component.html',
  styleUrls: ['./week-list.component.scss'],
  animations: [SlideInOutAnimation]
})
export class WeekListComponent implements OnInit {

  months = [{ id: '0', name: 'January' }, { id: '1', name: 'February' }, { id: '2', name: 'March' }, { id: '3', name: 'April' }, { id: '4', name: 'May' }, { id: '5', name: 'Jun' },
  { id: '6', name: 'July' }, { id: '7', name: 'August' }, { id: '8', name: 'September' }, { id: '9', name: 'October' }, { id: '10', name: 'November' }, { id: '11', name: 'December' }]

  animationState = 'out';
  testId: any;
  show: Boolean = false;
  index;
  constructor() { }

  ngOnInit() {
  }

  showWeeks(month, index) {
    console.log("month clicked", month, index);
    let firstDay = moment().startOf('month')
    console.log("firstDay", firstDay);
    
    // // this.show = true;
    // if(index){
    //   this.index = index
    //   // this.testId = month.id;
    //   // if (divName === 'divA') {
    //     console.log(this.animationState);
    //     this.animationState = this.animationState === 'out' ? 'in' : 'out';
    //   }
    // console.log(this.animationState);
    // // }


  }

}
