import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { InstructorService } from 'src/app/services/instructor.service';
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'app-admin-report-a',
  templateUrl: './admin-report-a.component.html',
  styleUrls: ['./admin-report-a.component.scss']
})
export class AdminReportAComponent implements OnInit {
  selectedDate: any;
  sort: MatSort;
  paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  searchText;

  displayedColumns: string[] = ['Instructor', 'LogIn', 'LunchStart', 'LunchEnd', 'LogOut', 'WorkHours', 'TravelHours', 'Total'];
  allInstrutors: any;

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  @ViewChild(MatPaginator, { static: true }) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  constructor(private _instructorService: InstructorService, public _filter: FilterService) {
    this.dataSource = new MatTableDataSource<any>();
   }

  ngOnInit() {
    this.getAllInstructors()
  }
  dateChanged(event){
    console.log("event", event);
    this.selectedDate = event.value;
    console.log("this.selectedDate", this.selectedDate);
  }
  filter(searchText) {
    console.log('FILTER CALLED', searchText);
    if (searchText === '') {
      this.dataSource = new MatTableDataSource(this.allInstrutors);
      this.dataSource.paginator = this.paginator;
      return;
    }
    let temp = this._filter.filter(searchText, this.allInstrutors, ['name']);
    this.updateData(temp)
  }
  updateData(logs) {
    console.log('UPDATING DATA = ', logs)
    this.dataSource = new MatTableDataSource(logs);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log('SETTING SORT TO = ', this.dataSource.sort)
    console.log('SETTING paginator TO = ', this.dataSource.paginator)
  }

  // API
  getAllInstructors(){
    this._instructorService.getInstructors().subscribe(instructorsResponse=>{
      console.log("instructorsResponse", instructorsResponse)
      this.allInstrutors = instructorsResponse;
      // this.dataSource = new MatTableDataSource<any>(this.allInstrutors)
    })
  }
}

// Time logs for ALL Instructors at a given date... API?
