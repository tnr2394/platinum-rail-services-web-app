import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AddCompModalComponent } from './add-comp-modal/add-comp-modal.component';

@Component({
  selector: 'app-competences',
  templateUrl: './competences.component.html',
  styleUrls: ['./competences.component.scss']
})
export class CompetencesComponent implements OnInit {

  constructor(public dialog: MatDialog, public _snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  addCompModal(){
    console.log("Open modal");
    this.openDialog(AddCompModalComponent).subscribe(data=>{
      console.log("Data in comp", data);
    })
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
