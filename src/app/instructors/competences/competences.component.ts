import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog, MatSnackBar, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AddCompModalComponent } from './add-comp-modal/add-comp-modal.component';
import { NewFileModalComponent } from 'src/app/files/new-file-modal/new-file-modal.component';

@Component({
  selector: 'app-competences',
  templateUrl: './competences.component.html',
  styleUrls: ['./competences.component.scss']
})
export class CompetencesComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  paginator: MatPaginator;
  sort: MatSort;
  displayedColumns = ['title', 'xDate', 'valid', 'attachment', 'action']
  compArray: any = [];
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
  constructor(public dialog: MatDialog, public _snackBar: MatSnackBar) { 
    this.dataSource = new MatTableDataSource(this.compArray)
  }

  ngOnInit() {
  }
  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  //   const paginatorIntl = this.paginator._intl;
  //   paginatorIntl.nextPageLabel = '';
  //   paginatorIntl.previousPageLabel = '';
  // }

  addCompModal(){
    console.log("Open modal");
    this.openDialog(AddCompModalComponent).subscribe(data=>{
      console.log("Data in comp", data);
      if(data == undefined) return
      else{
        this.compArray.push({title:data.title, expiryDate: data.xDate, valid:data.valid, attachment:'0'})
        this.updateData(this.compArray)
      }
    })
  }
  openFileUpload() {
    this.openDialog(NewFileModalComponent, { competencies: true }).subscribe(uploaded => {
      console.log("uploaded", uploaded);
    })
  }

  updateData(comp) {
    console.log("UPDATING DATA = ", comp)
    this.dataSource = new MatTableDataSource(comp);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log("SETTING SORT TO = ", this.dataSource.sort)
    console.log("SETTING paginator TO = ", this.dataSource.paginator)
  }
  openDialog(someComponent, data = {}): Observable<any> {
    console.log('OPENDIALOG', 'DATA = ', data)
    const dialogRef = this.dialog.open(someComponent, { data, width: '1000px', height: '967px' });

    return dialogRef.afterClosed();
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
