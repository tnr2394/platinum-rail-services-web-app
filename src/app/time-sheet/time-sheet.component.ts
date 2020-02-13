import { getTime } from 'date-fns';
import { TimeSheetService } from '../services/time-sheet.service';
import { Observable } from 'rxjs';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Select2OptionData } from 'ng2-select2';
import * as _ from 'lodash';

import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';
import { AddTimelogModalComponent } from './add-timelog-modal/add-timelog-modal.component';
import { InstructorService } from '../services/instructor.service';
import { FilterService } from '../services/filter.service';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

let recievedArray = [
  {
    timeLog: {
      date: "2020-01-16T18:30:00.000Z",
      in: {
        hours: "8",
        minutes: "00",
        type: 'AM'
      },
      lunchStart: {
        hours: "1",
        minutes: "00",
        type: 'PM'
      },
      lunchEnd: {
        hours: "2",
        minutes: "00",
        type: 'PM'
      },
      out: {
        hours: "10",
        minutes: "30",
        type: 'PM'
      },
      _id: "5e43f1c1e3164d08d18e3ba2"
    }
  },
  {
    timeLog: {
      date: "2020-02-16T20:30:00.000Z",
      in: {
        hours: "7",
        minutes: "00",
        type: "AM"
      },
      lunchStart: {
        hours: "2",
        minutes: "00",
        type: 'PM'
      },
      lunchEnd: {
        hours: "3",
        minutes: "00",
        type: 'PM'
      },
      out: {
        hours: "10",
        minutes: "30",
        type: 'PM'
      },
      _id: "5e43f1c1e3164d08d18e3ba1"
    }
  }
]

@Component({
  selector: 'app-time-sheet',
  templateUrl: './time-sheet.component.html',
  styleUrls: ['./time-sheet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeSheetComponent implements OnInit {
  public instToDisplay: Array<Select2OptionData>;
  public options: Select2Options;
  public current: string;
  lunchEnd;
  timeIn;
  lunchStart;
  timeOut;
  hours;
  minutes;
  instructorId;
  searchText;
  date = new Date();

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  activeDayIsOpen: boolean = true;
  refresh: Subject<any> = new Subject();

  // events: CalendarEvent[] = [
  //   {
  //     start: subDays(startOfDay(new Date()), 1),
  //     end: addDays(new Date(), 1),
  //     title: 'A 3 day event',
  //     color: colors.red,
  //     // actions: this.actions,
  //     allDay: true,
  //     resizable: {
  //       beforeStart: true,
  //       afterEnd: true
  //     },
  //     draggable: true
  //   },
  //   {
  //     start: startOfDay(new Date()),
  //     title: 'An event with no end date',
  //     color: colors.yellow,
  //     // actions: this.actions
  //   },
  //   {
  //     start: subDays(endOfMonth(new Date()), 3),
  //     end: addDays(endOfMonth(new Date()), 3),
  //     title: 'A long event that spans 2 months',
  //     color: colors.blue,
  //     allDay: true
  //   },
  //   {
  //     start: addHours(startOfDay(new Date()), 2),
  //     end: addHours(new Date(), 2),
  //     title: 'A draggable and resizable event',
  //     color: colors.yellow,
  //     // actions: this.actions,
  //     resizable: {
  //       beforeStart: true,
  //       afterEnd: true
  //     },
  //     draggable: true
  //   }
  // ];
  externalEvents: CalendarEvent[] = []
  
  events = [];
  allInstructors: any;
  currentUser: any;
  filteredInstructors: any;
  allInstructorsCopy: any;
  // instToDisplay: Observable<Array<Select2OptionData>> = [
  //   {
  //     id: "",
  //     text : ""
  //   }
  // ]
  constructor(private _timeSheetService: TimeSheetService, private _instructorService: InstructorService, public _filter: FilterService,
    public dialog: MatDialog, public _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.instToDisplay = [];
    this.populateAllLogs(recievedArray)
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (this.currentUser.userRole == 'admin') this.getInstructorList();
    if (this.currentUser.userRole == 'instructor')this.createNewExternalEvent();
    this.options = {
      multiple: true,
      placeholder: "Choose instructors"
    }
  }
  // CUSTOM METHODS
  openDialog(someComponent, data = {}): Observable<any> {
    console.log('OPENDIALOG', 'DATA = ', data)
    const dialogRef = this.dialog.open(someComponent, { data });

    return dialogRef.afterClosed();
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  makeEventsArrayForTimeLog(obj){
    console.log("makeEventsArrayForTimeLog", obj);
    // var events = [];
    var newObj = {
      start: new Date(obj.date),
      title : "Time Log",
      allDay : true,
      logId : obj._id,
      lunchStart : obj.lunchStart,
      lunchEnd: obj.lunchEnd,
      timeIn: obj.in,
      timeOut: obj.out
    }
    // events.push(newObj);
    this.refresh.next();
    console.log("newObj", newObj);
    return newObj;
  }
  populateAllLogs(recievedLogs){
    var temp = []
    for (var i = 0; i < recievedLogs.length; i++){
      console.log("in foor loop", i ,recievedLogs[i]);
      var events = this.makeEventsArrayForTimeLog(recievedLogs[i].timeLog)
      temp.push(events)
      this.events.push(events)
    }
    console.log("After populate ", temp);
  }
  changed(data: { value: string[] }) {
    console.log("change", data);
    this.current = data.value.join(' | ');
    console.log("this.current", this.current);
  }
  // filter(searchText) {
  //   console.log('FILTER CALLED', searchText);
  //   if (searchText === '') {
  //     return this.allInstructorsCopy = this.allInstructors;
  //   }
  //   let temp = this._filter.filter(searchText, this.allInstructors, ['name']);
  //   this.allInstructorsCopy = temp;
  // }

  createNewExternalEvent(){
   let tempExternalEvent =  {
      start: new Date(),
      title: 'Log time',
      allDay: true
    }
    this.externalEvents.push(tempExternalEvent)
    console.log("this.externalEvents", this.externalEvents);
  }
  // ANGULAR CALENDAR METHODS

  setView(view: CalendarView) {
    this.view = view;
  }
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log("Day clicked", "--date--", date , "--events--", events);
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }
  handleEvent(action: string, event: CalendarEvent): void {
    this.openDialog(AddTimelogModalComponent,event).subscribe(recievedEvent=>{
      if (recievedEvent == undefined) return
      console.log("data from modal", recievedEvent);
      var index = _.findIndex(this.events, function (o) { return o.logId == recievedEvent.data.logId})
      // this.events[index] = recievedEvent
      console.log("index is", index);
      console.log("this.events", this.events);
    })
  }
  eventDropped({
    event,
    newStart,
    newEnd,
    allDay
  }: CalendarEventTimesChangedEvent): void {
    const externalIndex = this.externalEvents.indexOf(event);
    if (typeof allDay !== 'undefined') {
      event.allDay = allDay;
    }
    event.start = newStart;
    if (newEnd) {
      event.end = newEnd;
    }
    let x = this.events.every(function (temp){
      if (temp.start.getDate() === newStart.getDate() && temp.start.getDay() === newStart.getDay() && temp.start.getMonth() === newStart.getMonth()){
        return false
      }
      else return true
    })

    if(x == true){
      console.log("in x == true");
      this.events = [...this.events, event];
      if (this.view === 'month') {
        this.viewDate = newStart;
        this.activeDayIsOpen = true;
      }
      if (externalIndex > -1) {
        this.externalEvents.splice(externalIndex, 1);
        this.createNewExternalEvent()
      }
      console.log("this.externalEvents", this.externalEvents);
    }
    console.log("this.events", this.events);
  }

  // tempClick(){
  //   this.openDialog(AddTimelogModalComponent, null).subscribe(event => {
  //     console.log("data from modal", event);
  //   })
  // }

  externalDrop(event: CalendarEvent) {
    // if (this.externalEvents.indexOf(event) === -1) {
    //   this.events = this.events.filter(iEvent => iEvent !== event);
    //   this.externalEvents.push(event);
    // }
  }
  

  // API
// getAllLogs(){
//   this._timeSheetService.getTimeLog().subscribe(res => {
//     console.log("res", res);
//   })}

  getInstructorList(){
    this._instructorService.getInstructors().subscribe(data=>{
      this.allInstructors = data;
      this.allInstructors.forEach(inst=>{
        let temp = {
          id: inst._id,
          text : inst.name
        }
        this.instToDisplay.push(temp)
        console.log("temp==", temp);
      })
      this.allInstructorsCopy = this.allInstructors;
      console.log("this.instToDisplay", this.instToDisplay);
    })
  }

}

// recievedArray.forEach(event => {
    //   console.log("for Each", event);
    //   return new Promise((resolve,reject)=>{
    //     let timeIn24 = this.convertTo24(event.timeLog.in)
    //     let lunchStart24 = this.convertTo24(event.timeLog.lunchStart)
    //     let lunchEnd24 = this.convertTo24(event.timeLog.lunchEnd)
    //     let timeOut24 = this.convertTo24(event.timeLog.out)
    //     let time24 = {timeIn24: timeIn24, lunchStart24: lunchStart24, lunchEnd24: lunchEnd24, timeOut24: timeOut24 }
    //     resolve({ time24: time24})
    //   }).then(time => {
    //     console.log("time in 'then'", time);
    //     // let totalHours = (time.lunchStart24) 
    //   })
    // })
// convertTo24(obj){
//   console.log("obj recieved", obj);
//   if (obj.type == 'PM' && obj.hours < 12) {
//     obj.hours = parseInt(obj.hours) + 12;
//     console.log("hours", obj.hours);
//   }
//   else if (obj.hours == 12 && obj.type == 'AM') {
//     obj.hours == '00'
//   }
//   return obj
// }