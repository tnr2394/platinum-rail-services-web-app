import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { NewFileModalComponent } from 'src/app/files/new-file-modal/new-file-modal.component';
import { CompetenciesService } from 'src/app/services/competencies.service';

@Component({
  selector: 'app-add-comp-modal',
  templateUrl: './add-comp-modal.component.html',
  styleUrls: ['./add-comp-modal.component.scss']
})
export class AddCompModalComponent implements OnInit {

  title;
  expiryDate;

  constructor(public dialogRef: MatDialogRef<AddCompModalComponent>, 
    public dialog: MatDialog, public _snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any,
    public _competencyService: CompetenciesService) { }

  ngOnInit() {
  }
  cancle(){
    this.dialogRef.close()
  }
  submit(){
    console.log("title", this.title, "x-date", this.expiryDate);
    if (this.title && this.expiryDate){
      let data = {
        title: this.title,
        expiryDate: this.expiryDate,
        instructorId : this.data.instructorId
      }
      this._competencyService.addCompetency(data).subscribe(res=>{
        console.log("response in add competency Modal", res);
        this.dialogRef.close(res.competencies)
      })
    }
    else {
      this.openSnackBar("Title and Expiry Date are required","OK");
    }
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

}
