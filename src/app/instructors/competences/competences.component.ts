import { Component, OnInit, ViewChild, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog, MatSnackBar, MatTableDataSource, MatPaginator, MatSort, MatSidenav } from '@angular/material';
import { AddCompModalComponent } from './add-comp-modal/add-comp-modal.component';
import { EditCompModalComponent } from './edit-comp-modal/edit-comp-modal.component'
import { NewFileModalComponent } from 'src/app/files/new-file-modal/new-file-modal.component';
import { ActivatedRoute } from '@angular/router';
import { CompetenciesService } from 'src/app/services/competencies.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DeleteConfirmModalComponent } from 'src/app/commons/delete-confirm-modal/delete-confirm-modal.component';
import * as _ from 'lodash';


@Component({
  selector: 'app-competences',
  templateUrl: './competences.component.html',
  styleUrls: ['./competences.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CompetencesComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  paginator: MatPaginator;
  sort: MatSort;
  displayedColumns = ['title', 'xDate', 'valid', 'attachment', 'action']
  compArray: any = [];
  instructorId;
  expandedElement;
  allFiles: any;
  file: any;
  currentUser: any;
  hideActions: boolean;
  loading;
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
  @ViewChild('sidenav', { static: false }) public mydsidenav: MatSidenav;

  @Input('deletedId') deletedId;
  @Output() openSideNav: EventEmitter<any> = new EventEmitter<any>();
  constructor(public dialog: MatDialog, public _snackBar: MatSnackBar, private activatedRoute: ActivatedRoute,
    public _competencyService: CompetenciesService) {
    this.dataSource = new MatTableDataSource(this.compArray)
  }

  ngOnInit() {
    this.loading = true;
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (this.currentUser.userRole == 'client'){
      this.displayedColumns = ['title', 'xDate', 'valid', 'attachment']
      this.hideActions = true
    }
    

    this.activatedRoute.params.subscribe(params => {
      this.instructorId = params['id'];
      console.log("this.instructorId =  ", this.instructorId);
    });
    this.getCompetencyData()
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.deletedId && changes.deletedId.currentValue) {
      this.loading = true
      this.deletedId = changes.deletedId.currentValue
      let tempdeletedId = this.deletedId
      console.log("*****this.deletedId", this.deletedId);
      var compIndex = _.findIndex(this.compArray, function (o) { return o._id == tempdeletedId.competenciesId })
      if (compIndex > -1) {
        var fileIndex = _.findIndex(this.compArray[compIndex].files, function (o) { return o._id == tempdeletedId.fileId })
        if (fileIndex > -1) {
          this.compArray[compIndex].files.splice(fileIndex, 1)
          this.updateData(this.compArray)
        }
      }
    }
  }
  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  //   const paginatorIntl = this.paginator._intl;
  //   paginatorIntl.nextPageLabel = '';
  //   paginatorIntl.previousPageLabel = '';
  // }

  addCompModal() {
    console.log("Open modal");
    this.openDialog(AddCompModalComponent, { instructorId: this.instructorId }).subscribe(data => {
      console.log("Data in comp", data);
      if (data == undefined) return
      else {
        console.group(" Check Data Here ")
        // console.log("data.expiryDate", data.expiryDate, "new Date()", new Date(), data.expiryDate < new Date());
        console.log(" new Date(data.expiryDate) ", new Date(data.expiryDate))
        console.log(" new Date() ", new Date())
        console.log(" Diff ", new Date(data.expiryDate) < new Date())
        data['isValid'] = ((new Date(data.expiryDate) < new Date()) == false) ? true : false
        console.groupEnd()

        // this.getCompetencyData()
        this.compArray.push(data)
        this.updateData(this.compArray)
      }
    })
  }
  openFileUpload(element, i) {
    console.log("element in file upload", element, i);
    this.openDialog(NewFileModalComponent, { competenciesId: element._id }).subscribe(uploaded => {
      console.log("uploaded", uploaded);
      let tempArray = this.compArray

      if (uploaded && uploaded[0] && uploaded[0].data) {
        var index = _.findIndex(tempArray, function (o) { return o._id == element._id })
        if (index > -1) {
          this.compArray[index].files.push(uploaded[0].data.file)
          this.updateData(this.compArray)
        }
      }

      // console.log("this.compArray",this.compArray[i])
      // this.compArray[i].files.push(uploaded[0].data.file)

    })
  }

  updateData(comp) {
    console.log("UPDATING DATA = ", comp)
    this.dataSource = new MatTableDataSource(comp);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log("SETTING SORT TO = ", this.dataSource.sort)
    console.log("SETTING paginator TO = ", this.dataSource.paginator)
    this.loading = false;
  }
  openDialog(someComponent, data = {}): Observable<any> {
    console.log('OPENDIALOG', 'DATA = ', data)
    const dialogRef = this.dialog.open(someComponent, { data, width: 'auto', height: '967px' });

    return dialogRef.afterClosed();
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  expand(element) {
    console.log("***element", element)
    this.expandedElement = element
    this.allFiles = element.files
  }
  fileDetails(event) {
    console.log("event file tile clicked", event);
    console.log("this.expandedElement = element", this.expandedElement);
    this.file = event.file
    this.openSideNav.emit({ compId: this.expandedElement, file: event, })
    // this.mydsidenav.open();
  }
  editCompModal(element) {
    this.openDialog(EditCompModalComponent, element).subscribe(data => {
      console.log("DATA IN COMP FROM EDIT", data)
    })
  }
  delete(element, i) {
    this.openDialog(DeleteConfirmModalComponent, element).subscribe(confirm => {
      if (confirm == 'no') return
      else {
        console.log("element on delete", element, i);
        this._competencyService.deleteCompetency(element._id).subscribe(res => {
          console.log("Competency deleted====>>>", res);
          this.getCompetencyData();
          this.compArray.splice(i, 1)
          this.updateData(this.compArray)
        })
      }
    })
  }
  deletedFile(event) {
    console.log("**********file deleted event in competencies", event)
  }

  // API
  getCompetencyData() {
    this._competencyService.getCompetencies(this.instructorId).subscribe(res => {
      console.log("***res in comp = ", res.competencies);
      this.compArray = res.competencies
      console.log("***this.compArray", this.compArray);
      this.updateData(this.compArray)
      this.loading = false;
    })
  }
  deleteFile(event) {
    console.log('delete Event:', event);
  }
}
