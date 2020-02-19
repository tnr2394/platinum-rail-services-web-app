import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { InstructorService } from 'src/app/services/instructor.service';
import { Select2OptionData } from 'ng2-select2';
import { ActivatedRoute, Router } from '@angular/router';
import { TimeSheetService } from 'src/app/services/time-sheet.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { InstructorConfirmationModalComponent } from './instructor-confirmation-modal/instructor-confirmation-modal.component';
import * as Moment from 'moment';

@Component({
  selector: 'app-admin-time-sheet',
  templateUrl: './admin-time-sheet.component.html',
  styleUrls: ['./admin-time-sheet.component.scss']
})


export class AdminTimeSheetComponent implements OnInit {
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[]
    // = ['11/11,Monday', '11/11,Tuesday', '11/11,Wednesday', '11/11,Thursday', '11/11,Friday', '11/11,Saturday', '11/11,Monday'];
  public barChartType: ChartType = 'line';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [{ data: [], label: '' }];
  
  allInstructors = [];
  public instToDisplay: Array<Select2OptionData> = [];
  public options: Select2Options;
  public current: string;
  queryParamsObj = {};
  value: string[];
  view: string;
  
  // instructors = [{name:'Inst '}]


  constructor(private _instructorService: InstructorService, private _timeSheetService: TimeSheetService,
    private route: ActivatedRoute, private router: Router, public dialog: MatDialog, public _snackBar: MatSnackBar) { 
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  ngOnInit() {
    this.options = { multiple: true }
    this.view = "Week"
    this.route.queryParams.subscribe(params => {
      console.log("params", params, typeof (params));
      if (params.instructorId) {
        this.value = [(params.instructorId)];
        console.log("value", this.value);
        let tempArray = params.instructorId.split('|')
        tempArray.forEach(id=>{this.value.push(id)})
        // this.value = tempArray.forEach(value=>{ if(value) value = value.trim()})
      }
    });
    this.getInstructorList();
  }
  findInstructor(index){
    let instructor = this.allInstructors[index]
    console.log("instructor", instructor);
    
  }
  public chartClicked(e: any): void {
    console.log("THE DATA IS", this.barChartData);
    console.log("e in chart clicked",e);
    let instructorName;
    if (e.active[0]){
      const chart = e.active[0]._chart;
      const activePoints = chart.getElementAtEvent(e.event);
      if (activePoints.length > 0) {
        console.log("activePoints",activePoints)
        console.log("chart.data", chart.data);
        const datasetIndex = activePoints[0]._datasetIndex;
        const clickedElementIndex = activePoints[0]._index;
        const label = chart.data.labels[clickedElementIndex];
        const value = chart.data.datasets[datasetIndex].data[clickedElementIndex];
        console.log("datasetIndex", datasetIndex);
        console.log("clickedElementIndex", clickedElementIndex, "label", label, value)
        this.getActualData(value, clickedElementIndex)
        // instructorName = this.allInstructors[datasetIndex-1].name
        // this.router.navigate(['week-list'], { state: { instructor: instructorName } })
      // }
      }
    }
  }
  getActualData(value,index){
    const actualData = []
      this.barChartData.forEach((chartData, i) => {
        if (chartData.data[index] == value) actualData.push(this.allInstructors[i])
        else console.log("Not Same at", chartData.label);
    })
    console.log("actualData", actualData);
    if(actualData.length > 1) {
      console.log("Open PopUp")
      this.openDialog(InstructorConfirmationModalComponent, actualData).subscribe(instChosen=>{
        if(instChosen == undefined) return
        else{
          this.router.navigate(['week-list'], { state: { instructor: instChosen } })
        }
      })
    }
    else this.router.navigate(['week-list'], { state: { instructor: actualData } })
  }
  instructorChanged(data: { value: string[] }) {
    console.log("change", data.value);
    this.current = data.value.join('|');
    this.queryParamsObj['instructorId'] = this.current;
    console.log("this.current", this.current);
  }
  changeQuery() {
    // this.router.navigate(['.'], { relativeTo: this.route, queryParams: this.queryParamsObj });
    // console.log("this.queryParamsObj", this.queryParamsObj);
    // TEST
    this.barChartData.push({ data: [0, -1, 3, -3, 2, 3, 0, -5, 5, 0, 0, -10], label: 'Intructor Added' })

  }
  viewType(value){
    if(value == 'Year') {
    this.barChartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    }
    else this.getChartLabels(value)
    // else if(value == 'Month'){
    //   this.barChartLabels = ['Week 1', 'Week 2', 'Week 4', 'Week 5'];
    // }
  }
  getChartLabels(view){
    if (view == 'Week') {
      this.barChartLabels = ['11/11,Monday', '11/11,Monday', '11/11,Monday', '11/11,Monday', '11/11,Monday', '11/11,Monday', '11/11,Monday'];
    }
  }
  colorGen() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return "rgba(" + r + "," + g + "," + b + ",0.1)"
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
  getWeekDates(week) {
    // var currentDate = moment();

    // var weekStart = currentDate.clone().startOf('isoWeek');
    // var weekEnd = currentDate.clone().endOf('isoWeek');

    let dates = []
    // dates.push(week.weekStartDate)
    while (week.weekStartDate.add(1, 'days').diff(week.weekEndDate) < 0) {
      console.log(week.weekStartDate.toDate());
      dates.push(week.weekStartDate.clone().format('MM/DD/YYYY'));
    }
    console.log("dates:", dates);
  }
  // API 
  getInstructorList() {
    this._instructorService.getInstructors().subscribe(data => {
      this.allInstructors = data;
      console.log("this.allInstructors", this.allInstructors);
      this.allInstructors.forEach(inst => {
        let backGroundColor = this.colorGen()
        let temp = {
          id: inst._id,
          text: inst.name
        }
        this.instToDisplay.push(temp)
        console.log("temp==", temp);
      })
      this.barChartData.splice(0,1)
      // this.allInstructorsCopy = this.allInstructors;
      console.log("this.instToDisplay", this.instToDisplay);
    })
  }
  getInstructorLogs(id) {
    let data = {
      instructorId: "5e293b0fa452624cba0dcfd5",

    }
    this._timeSheetService.getTimeLogUsingDates(id).subscribe(logs => {
      console.log("logs", logs);
      // if (inst._id == "5e293b0fa452624cba0dcfd5") {
      //   let dataForChart = {
      //     label: inst.name,
      //     data: [12, 6, 1, 20],
      //     backgroundColor: backGroundColor
      //   }
      //   this.barChartData.push(dataForChart)
      // }
      
    })
  }

}
