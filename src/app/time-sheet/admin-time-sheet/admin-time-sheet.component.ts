import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-admin-time-sheet',
  templateUrl: './admin-time-sheet.component.html',
  styleUrls: ['./admin-time-sheet.component.scss']
})
export class AdminTimeSheetComponent implements OnInit {
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September','October','November','December'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [0, -8, -3, 3, 6, 0, 0, -5, 5, 0, 0, -10], label: 'Intructor A' },
    { data: [9, 1, 5, -10, -5, 0, 0, 6, 2, 1, 0, -1], label: 'Intructor B' }
  ];

  constructor() { }

  ngOnInit() {
  }

}
