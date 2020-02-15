import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent, MatDialog } from '@angular/material';

import { TimeSheetService } from '../../services/time-sheet.service';

@Component({
  selector: 'app-time-sheet-summary',
  templateUrl: './time-sheet-summary.component.html',
  styleUrls: ['./time-sheet-summary.component.scss']
})
export class TimeSheetSummaryComponent implements OnInit {

  instructorId;
  loading: Boolean;
  clients: any = [];
  bgColors: string[];
  lastColor;
  length;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  displayedColumns: string[] = ['Date','In', 'lunchStart', 'lunchEnd','Out','workingHours'];
  dataSource: MatTableDataSource<any>;
  paginator: MatPaginator;

  constructor(public _timeSheetService: TimeSheetService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.instructorId = params['id'];
      console.log("InstructorId", this.instructorId);
    });
    this.getInstructorTimeLogs();
  }

  updateData(clients) {
    console.log("UPDATING DATA = ", clients)
    this.dataSource = new MatTableDataSource(clients);
    this.dataSource.paginator = this.paginator;
    console.log("SETTING SORT TO = ", this.dataSource.sort)
    console.log("SETTING paginator TO = ", this.dataSource.paginator)
  }


  getInstructorTimeLogs() {
    this._timeSheetService.getInstructorTimeLog(this.instructorId).subscribe(res => {
      console.log('Res========>>>>>', res);
      this.updateData(res[0].dateWiseTimeLogs)
    }, err => {

    })
  }

}
