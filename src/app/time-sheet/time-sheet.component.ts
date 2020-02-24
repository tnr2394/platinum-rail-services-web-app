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
  CalendarView,
  CalendarEventTitleFormatter,
} from 'angular-calendar';
import { AddTimelogModalComponent } from './add-timelog-modal/add-timelog-modal.component';
import { InstructorService } from '../services/instructor.service';
import { FilterService } from '../services/filter.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomEventTitleFormatter } from './custom-event-title-formatter.provider';

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
  // {
  //   timeLog: {
  //     date: "2020-01-16T18:30:00.000Z",
  //     in: {
  //       hours: "8",
  //       minutes: "00",
  //       type: 'AM'
  //     },
  //     lunchStart: {
  //       hours: "1",
  //       minutes: "00",
  //       type: 'PM'
  //     },
  //     lunchEnd: {
  //       hours: "2",
  //       minutes: "00",
  //       type: 'PM'
  //     },
  //     out: {
  //       hours: "10",
  //       minutes: "30",
  //       type: 'PM'
  //     },
  //     _id: "5e43f1c1e3164d08d18e3ba2"
  //   }
  // },
  // {
  //   timeLog: {
  //     date: "2020-02-16T20:30:00.000Z",
  //     in: {
  //       hours: "7",
  //       minutes: "00",
  //       type: "AM"
  //     },
  //     lunchStart: {
  //       hours: "2",
  //       minutes: "00",
  //       type: 'PM'
  //     },
  //     lunchEnd: {
  //       hours: "3",
  //       minutes: "00",
  //       type: 'PM'
  //     },
  //     out: {
  //       hours: "10",
  //       minutes: "30",
  //       type: 'PM'
  //     },
  //     _id: "5e43f1c1e3164d08d18e3ba1"
  //   }
  // }
]

@Component({
  selector: 'app-time-sheet',
  templateUrl: './time-sheet.component.html',
  styleUrls: ['./time-sheet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter
    }
  ]
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
  view: CalendarView = CalendarView.Week;
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
  externalEvents: CalendarEvent[] = [
    {
      start: new Date(),
      end: addHours(new Date(), 1),
      title: "Slot-1",
      // end: addHours(new Date(), 1),
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      color: colors.blue
    },
    {
      start: new Date(),
      end: addHours(new Date(), 1),
      title: "Slot-2",
      // end: addHours(new Date(), 1),
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      color: colors.blue
    }
  ]

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
  queryParamsObj = {}
  value: string[];
  constructor(private _timeSheetService: TimeSheetService, private _instructorService: InstructorService, public _filter: FilterService,
    public dialog: MatDialog, public _snackBar: MatSnackBar, private route: ActivatedRoute, private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  ngOnInit() {
    let testDate = "2020-02-14T05:32:34.155Z"
    console.log("testDate", testDate );
    let temp = new Date(testDate)
    console.log("temp before set hours", temp);
    temp.setHours(5,5,5)
    console.log("temp after set hours", temp);
    
    // this.route.queryParams.subscribe(params => {
    //   console.log("params", params, typeof (params));
    //   if (params) {
    //     // this.value = [(params.instructorId)];
    //     // console.log("value", this.value);
    //     // let tempArray = params.instructorId.split('|')
    //     // this.value = tempArray.forEach(value=>{ if(value) value = value.trim()})
    //   }
    // })
    // this.instToDisplay = [];

    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    // if (this.currentUser.userRole == 'admin') this.getInstructorList();
    if (this.currentUser.userRole == 'instructor') this.getInstructorLogs(this.currentUser._id)
    // this.options = {
    //   multiple: true,
    //   placeholder: "Choose instructors",
    //   // tags: s
    // }
  }

  // CUSTOM METHODS
  changeQuery() {
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: this.queryParamsObj });
    console.log("this.queryParamsObj", this.queryParamsObj);
  }
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

  makeEventsArrayForTimeLog(obj) {
    obj.time.lunchStart.hours == '-' ? obj.time.lunchStart.hours = 0 : obj.time.lunchStart.hours
    obj.time.lunchStart.minutes == '-' ? obj.time.lunchStart.minutes = 0 : obj.time.lunchStart.minutes
    obj.time.lunchEnd.hours == '-' ? obj.time.lunchEnd.hours = 0 : obj.time.lunchEnd.hours
    obj.time.lunchEnd.minutes == '-' ? obj.time.lunchEnd.minutes = 0 : obj.time.lunchEnd.minutes
    obj.time.out.hours == '-' ? obj.time.out.hours = 0 : obj.time.out.hours
    obj.time.out.minutes == '-' ? obj.time.out.minutes = 0 : obj.time.out.minutes
    // var events = [];
    var eventSlot1 = {
      start: new Date(obj.date),
      end: new Date((new Date(obj.date)).setHours(obj.time.lunchStart.hours, obj.time.lunchStart.minutes)),
      title: "Slot-1",
      logId: obj._id,
      lunchStart: obj.lunchStartTime,
      timeIn: obj.logInTime
    }
    var eventSlot2 = {
      start: new Date((new Date(obj.date)).setHours(obj.time.lunchEnd.hours, obj.time.lunchEnd.minutes)),
      end: new Date((new Date(obj.date)).setHours(obj.time.out.hours, obj.time.out.minutes)),
      title: "Slot-2",
      color: colors.red,
      logId: obj._id,
      lunchEnd: obj.lunchEndTime,
      timeOut: obj.logOutTime
    }
    let newObj = {
      event1 : eventSlot1,
      event2 : eventSlot2
    }
    // events.push(newObj);
    this.refresh.next();
    console.log("newObj", eventSlot1, eventSlot2);
    return newObj;
  }
  populateAllLogs(recievedLogs) {
    var temp = []
    for (var i = 0; i < recievedLogs.length; i++) {
      console.log("in foor loop", i, recievedLogs[i]);
      var events = this.makeEventsArrayForTimeLog(recievedLogs[i])
      temp.push(events.event1,events.event2)
      // this.events.push(temp)
    }
    this.events = temp;
    console.log("After populate temp", temp);
    console.log("After populate this.events", this.events);
    console.log("this.queryParamsObj", this.queryParamsObj);
  }
  changed(data: { value: string[] }) {
    console.log("change", data);
    this.current = data.value.join(' | ');
    this.queryParamsObj['instructorId'] = this.current;
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

  createNewExternalEvent(eventTitle) {
    let tempExternalEvent = {
      start: new Date(),
      end: addHours(new Date(), 1),
      title: eventTitle,
      // end: addHours(new Date(), 1),
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
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
    console.log("Day clicked", "--date--", date, "--events--", events);
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
  handleEvent(action: string, event): void {
    console.log("Event Clicked", event);
    let data;
    let index;
    index = event.logId ? _.findIndex(recievedArray, function(o) {return o._id == event.logId }) : -1
    data = (index > -1) ? recievedArray[index] : event
    
    this.openDialog(AddTimelogModalComponent, data).subscribe(recievedEvent => {
      if (recievedEvent == undefined) return
      console.log("data from modal", recievedEvent);
      let tempEvent = {
        date : recievedEvent.data.date,
        time : recievedEvent.data.time,
        logInTime: recievedEvent.data.time.in.hours + ":" + recievedEvent.data.time.in.minutes,
        logOutTime: recievedEvent.data.time.out.hours + ":" + recievedEvent.data.time.out.minutes,
        lunchEndTime: recievedEvent.data.time.lunchEnd.hours + ":" + recievedEvent.data.time.lunchEnd.minutes,
        lunchStartTime: recievedEvent.data.time.lunchStart.hours + ":" + recievedEvent.data.time.lunchStart.minutes,
        _id: recievedEvent.data.logId
      }
      if (recievedEvent.action == 'edited'){
        var index = _.findIndex(this.events, function (o) { return o.logId == recievedEvent.data.logId })
        if (index > -1) this.events.splice(index, 1)
      }
      console.log("tempEvent" ,tempEvent);
      let newObj = this.makeEventsArrayForTimeLog(tempEvent)
      console.log("newObj", newObj);
      this.events.pop()
      this.events.push(newObj.event1, newObj.event2)
      this.refresh.next();
      // this.populateAllLogs(tempEvent)
      // if (index > -1) this.events[index] = tempEvent
      // this.populateAllLogs(tempEvent)
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
    console.log("ON DROP", event);
    const externalIndex = this.externalEvents.indexOf(event);
    // if(this.events){
    //   this.events.every()
    // }
    if (typeof allDay !== 'undefined') {
      event.allDay = allDay;
    }
    event.start = newStart;
    event.end = addHours(newStart, 1)
    // if (newEnd) {
    //   event.end = newEnd;
    // }
    let x = this.events.every(function (temp) {
      if (temp.start.getDate() === newStart.getDate() && temp.start.getDay() === newStart.getDay() && temp.start.getMonth() === newStart.getMonth() && temp.title == event.title) {
        return false
      }
      else {
        console.log("firs else");
        // if (event.title == 'Slot-2') {
          // console.log("event.title == 'Slot-2'");
          // console.log("temp.lunchEnd", temp.lunchEnd);
          // if(temp.lunchEnd != undefined && temp.lunchEnd.hours != "--:--"){
          //   console.log("temp.lunchEnd", temp.lunchEnd, temp.lunchEnd.hours);
          //   let lunchEndMilliSeconds = ((temp.lunchEnd.hours * 60 * 60 + temp.lunchEnd.minutes * 60) * 1000)
          //   console.log("templunchEndDate", lunchEndMilliSeconds);
          //   if (lunchEndMilliSeconds <= event.start.getMilliseconds()) return false; else return true
          // }
          return true
        // }
        // else return true
      }
    })
    console.log("x-----", x);
    // let x = true
    if (x == true) {
      console.log("in x == true");
      this.events = [...this.events, event];
      // if (this.view === 'month') {
      //   this.viewDate = newStart;
      //   this.activeDayIsOpen = true;
      // }
      if (externalIndex > -1) {
        this.externalEvents.splice(externalIndex, 1);
        this.createNewExternalEvent(event.title)
      }
      console.log("this.externalEvents", this.externalEvents);
    }
    console.log("this.events", this.events);
    this.refresh.next();
  }
  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.refresh.next();
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

  getInstructorList() {
    this._instructorService.getInstructors().subscribe(data => {
      this.allInstructors = data;
      this.allInstructors.forEach(inst => {
        let temp = {
          id: inst._id,
          text: inst.name
        }
        this.instToDisplay.push(temp)
        console.log("temp==", temp);
      })
      this.allInstructorsCopy = this.allInstructors;
      console.log("this.instToDisplay", this.instToDisplay);
    })
  }
  getInstructorLogs(id) {
    this._timeSheetService.getInstructorTimeLog(id).subscribe(logs => {
      console.log("logs", logs);
      // FOR SINGLE INSRUCTOR
      logs[0].dateWiseTimeLogs.forEach(log => {
        // if (log.lunchStart != "-:- -") {
        //   log['end'] = new Date(((log.lunchStart.hours * 60 * 60 + log.lunchStart.minutes * 60) * 1000))
        //   log.title = "Slot-1 Before Lunch"  
        // }
        // else if (log.lunchStart)
        recievedArray.push(log)
      })
      console.log("recievedArray", recievedArray);
      this.populateAllLogs(recievedArray)
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