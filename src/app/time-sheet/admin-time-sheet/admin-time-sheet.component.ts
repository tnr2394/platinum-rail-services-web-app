import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { InstructorService } from 'src/app/services/instructor.service';
import { Select2OptionData } from 'ng2-select2';
import { ActivatedRoute, Router } from '@angular/router';
import { TimeSheetService } from 'src/app/services/time-sheet.service';

@Component({
  selector: 'app-admin-time-sheet',
  templateUrl: './admin-time-sheet.component.html',
  styleUrls: ['./admin-time-sheet.component.scss']
})


export class AdminTimeSheetComponent implements OnInit {
  public barChartOptions: ChartOptions = {
    responsive: true
  };
  public barChartLabels: Label[] = ['11/11,Monday', '11/11,Monday', '11/11,Monday', '11/11,Monday', '11/11,Monday', '11/11,Monday', '11/11,Monday'];
  public barChartType: ChartType = 'line';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [12, 10, 20, 30, 11, 15, 19, 8, 5, 0, 0, 10], label: 'Intructor A', backgroundColor: "rgba(255,175,211,0.1)" },
    { data: [8, 10, 17, 12, 3, 9, 15, 6, 2, 1, 0, 1], label: 'Intructor B', backgroundColor: "rgba(175,211,56,0.1)" }
  ];
  
    // = [{ data: [], label: '' }];
  
  allInstructors = [];
  public instToDisplay: Array<Select2OptionData> = [];
  public options: Select2Options;
  public current: string;
  queryParamsObj = {};
  value: string[];
  view: string;
  
  // instructors = [{name:'Inst '}]


  constructor(private _instructorService: InstructorService, private _timeSheetService: TimeSheetService,
    private route: ActivatedRoute, private router: Router) { 
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
  public chartClicked(e: any): void {
    console.log("e in chart clicked",e);
    let instructorName;
    if (e.active.length > 0) {
      const chart = e.active[0]._chart;
      const activePoints = chart.getElementAtEvent(e.event);
      if (activePoints.length > 0) {
        console.log("activePoints",activePoints)
        console.log("chart.data", chart.data);
        // get the internal index of slice in pie chart
        const datasetIndex = activePoints[0]._datasetIndex;
        const clickedElementIndex = activePoints[0]._index;
        const label = chart.data.labels[clickedElementIndex];
        // get value by index
        const value = chart.data.datasets[datasetIndex].data[clickedElementIndex];
        console.log("datasetIndex", datasetIndex);
        console.log("clickedElementIndex", clickedElementIndex, "label", label, value)
        instructorName = this.allInstructors[datasetIndex-1].name
        // this.router.navigate(['week-list'], { state: { instructor: instructorName } })
      }
    }
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
    // else if(value == 'Week'){
    //   this.barChartLabels = ['11/11,Monday', '11/11,Monday', '11/11,Monday', '11/11,Monday', '11/11,Monday', '11/11,Monday', '11/11,Monday'];
    // }
  }
  getChartLabels(view){

  }
  colorGen() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return "rgba(" + r + "," + g + "," + b + ",0.1)"
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
        let dataForChart = {
          label: inst.name,
          data: [12,6,1,20],
          backgroundColor: backGroundColor
        }
        this.barChartData.push(dataForChart)
        this.instToDisplay.push(temp)
        console.log("temp==", temp);
      })
      // this.allInstructorsCopy = this.allInstructors;
      console.log("this.instToDisplay", this.instToDisplay);
    })
  }
  getInstructorLogs(id) {
    this._timeSheetService.getInstructorTimeLog(id).subscribe(logs => {
      console.log("logs", logs);
      // FOR SINGLE INSRUCTOR
      // logs[0].dateWiseTimeLogs.forEach(log => {
        
      // })
    })
  }

}
