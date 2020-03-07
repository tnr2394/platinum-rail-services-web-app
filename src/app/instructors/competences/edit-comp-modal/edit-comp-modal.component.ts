import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { AddCompModalComponent } from '../add-comp-modal/add-comp-modal.component';
import { CompetenciesService } from 'src/app/services/competencies.service';

@Component({
  selector: 'app-edit-comp-modal',
  templateUrl: './edit-comp-modal.component.html',
  styleUrls: ['./edit-comp-modal.component.scss']
})
export class EditCompModalComponent implements OnInit {

  title;
  expiryDate;
  competenciesId;

  constructor(public dialogRef: MatDialogRef<AddCompModalComponent>,
    public dialog: MatDialog, public _snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any,
    public _competencyService: CompetenciesService) { }

  ngOnInit() {
    console.log("data in edit", this.data);
    this.title = this.data.title
    this.expiryDate = this.data.expiryDate
    this.competenciesId = this.data._id;
  }
  cancle() {
    this.dialogRef.close()
  }
  submit(){
    console.log("title", this.title, "x-date", this.expiryDate);
    if (this.title && this.expiryDate) {
      let data = {
        title: this.title,
        expiryDate: this.expiryDate,
        competenciesId: this.competenciesId
      }
      this._competencyService.updateCompetency(data).subscribe(res => {
        console.log("response in edit competency Modal", res);
        this.dialogRef.close(res.competencies)
      })
    }
    else {
      this.openSnackBar("Title and Expiry Date are required", "OK");
    }
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
