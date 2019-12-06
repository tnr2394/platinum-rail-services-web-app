import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LearnerService } from '../../services/learner.service';
import { trigger, transition, style, animate, useAnimation, query, stagger, keyframes } from '@angular/animations';
import { bounce } from 'ng-animate';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent, MatDialog } from '@angular/material';
import { FilterService } from "../../services/filter.service";


@Component({
  selector: 'app-single-learner',
  templateUrl: './single-learner.component.html',
  styleUrls: ['./single-learner.component.scss'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ height: 0, opacity: 0 }),
            animate('1s ease-out',
              style({ height: 300, opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ height: 300, opacity: 1 }),
            animate('1s ease-in',
              style({ height: 0, opacity: 0 }))
          ]
        )
      ]
    ),
    trigger('bounce', [transition('* => *', useAnimation(bounce))]),
    trigger('listAnimation', [
      transition('* => *', [ // each time the binding value changes
        query(':leave', [
          stagger(100, [
            animate('0.5s', style({ opacity: 0 }))
          ])
        ], { optional: true }),
        query(':enter', [
          // style({ opacity: 0 }),
          stagger(100, [

            animate('1s ease-in', keyframes([
              style({ opacity: 0, transform: 'translateY(-75%)', offset: 0 }),
              style({ opacity: .5, transform: 'translateY(35px)', offset: 0.3 }),
              style({ opacity: 1, transform: 'translateY(0)', offset: 1.0 }),
            ]))
          ])
        ])
      ])
    ])
  ]
})

export class SingleLearnerComponent implements OnInit {

  length;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  bgColors: string[];
  lastColor;
  learner;
  loading;
  data: any;
  displayedColumns: string[] = ['unit', 'assignment', 'status'];
  dataSource: MatTableDataSource<any>;
  paginator: MatPaginator;
  sort: MatSort;

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


  constructor(private activatedRoute: ActivatedRoute, public _filter: FilterService, private _learnerService: LearnerService) {
    this.bgColors = ["badge-info", "badge-success", "badge-warning", "badge-primary", "badge-danger"];
    this.data = {
      title: ""
    }
    this.learner = [];
    console.log('this.learner.allotments', this.learner);
    this.dataSource = new MatTableDataSource(this.learner);
  }

  ngAfterViewInit() {
    console.log("this.dataSource", this.dataSource);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    console.log('Apply Filter Calling', filterValue);
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(' this.dataSource.filter', this.dataSource.filter);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }




  ngOnInit() {
    this.getAllotments();
  }


  updateData(clients) {
    console.log("UPDATING DATA = ", clients)
    this.dataSource = new MatTableDataSource(clients);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log("SETTING SORT TO = ", this.dataSource.sort)
    console.log("SETTING paginator TO = ", this.dataSource.paginator)

  }

  getAllotments() {
    this.activatedRoute.params.subscribe(params => {
      console.log(params['id']);
      this._learnerService.getLearner(params['id']).subscribe(data => {
        console.log("RECEIVED = ", data)
        this.learner = data.pop();
        console.log("THIS LEARNER ALLOTMENT ARRAY = ");
        this.updateData(this.learner.allotments)
      });
    })
  }



  getRandomColorClass(i) {
    var rand = Math.floor(Math.random() * this.bgColors.length);
    rand = i % 5;
    this.lastColor = rand;
    return this.bgColors[rand];
  }

  validate(data) {
    console.log("Validating ", data);
    if (!data.title) return false;

    return true;
  }
}

