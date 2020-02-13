import { getTime } from 'date-fns';
import { TimeSheetService } from '../services/time-sheet.service';
import { Observable } from 'rxjs';
import { MatDialog, MatSnackBar } from '@angular/material';
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
        minutes: "05",
        type: 'AM'
      },
      lunchStart: {
        hours: "2",
        minutes: "10"
      },
      lunchEnd: {
        hours: "3",
        minutes: "20"
      },
      out: {
        hours: "10",
        minutes: "30"
      },
      _id: "5e43f1c1e3164d08d18e3ba1"
    }
  },
  {
    timeLog: {
      date: "2020-02-16T20:30:00.000Z",
      in: {
        hours: "8",
        minutes: "05",
        type: "AM"
      },
      lunchStart: {
        hours: "2",
        minutes: "10"
      },
      lunchEnd: {
        hours: "3",
        minutes: "20"
      },
      out: {
        hours: "10",
        minutes: "30"
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
  lunchEnd;
  timeIn;
  lunchStart;
  timeOut;
  hours;
  minutes;
  instructorId;
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
  externalEvents: CalendarEvent[] = [
    {
      start: new Date(),
      title: 'Log time',
      allDay: true
    }
  ]
  
  events = [];
  constructor(private _timeSheetService: TimeSheetService, public dialog: MatDialog, public _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.populateAllLogs(recievedArray)
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
  // ANGULAR CALENDAR METHODS

  setView(view: CalendarView) {
    this.view = view;
  }
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
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
    this.openDialog(AddTimelogModalComponent,event).subscribe(event=>{
      console.log("data from modal", event);
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
    if (externalIndex > -1) {
      this.externalEvents.splice(externalIndex, 1);
      this.events.push(event);
    }
    event.start = newStart;
    if (newEnd) {
      event.end = newEnd;
    }
    if (this.view === 'month') {
      this.viewDate = newStart;
      this.activeDayIsOpen = true;
    }
    this.events = [...this.events];
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

}
