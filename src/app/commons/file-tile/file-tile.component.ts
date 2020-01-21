import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileService } from 'src/app/services/file.service';
import { from, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteConfirmModalComponent } from '../delete-confirm-modal/delete-confirm-modal.component';
import { MatDialog, MatSnackBar } from '@angular/material';
@Component({
  selector: 'file-tile',
  templateUrl: './file-tile.component.html',
  styleUrls: ['./file-tile.component.scss']
})
export class FileTileComponent implements OnInit {




  @Input('file') file: any;
  @Output() deletedFile: EventEmitter<any> = new EventEmitter<any>();
  @Output() getFiles: EventEmitter<any> = new EventEmitter<any>();
  loading: boolean;

  isSubmission;

  constructor(public _fileService: FileService, private route: ActivatedRoute, public router: Router,
     public dialog: MatDialog, public _snackBar: MatSnackBar) {
    if (this.router.url.includes('submission') || this.router.url.includes('learnerAllotment')) {
      this.isSubmission = true;
    } else {
      this.isSubmission = false;
    }
  }


  ngOnInit() {
    console.log("file tile initialized file= ", this.file);

    console.log(' this.isSubmission', this.isSubmission);
  }

  openDialog(someComponent, data = {}): Observable<any> {
    console.log('OPENDIALOG', 'DATA = ', data)
    const dialogRef = this.dialog.open(someComponent, { data: 'file'});

    return dialogRef.afterClosed();
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }


  delete() {
    this.openDialog(DeleteConfirmModalComponent).subscribe(confirm=>{
      console.log("CONFIRM", confirm);
      if(confirm == '') return
      if(confirm == 'yes'){
        if (this.isSubmission) {
          this._fileService.deleteSubmissionFiles(this.file._id).subscribe(file => {
            console.log("Deleted File. ID = ", this.file._id);
            this.loading = false;
            this.deletedFile.emit(this.file._id);
          }, err => {
            alert("Error deleting file.")
          });

        } else {
          this._fileService.deleteFiles(this.file._id).subscribe(file => {
            console.log("Deleted File. ID = ", this.file._id);
            this.loading = false;
            this.deletedFile.emit(this.file._id);
          }, err => {
            alert("Error deleting file.")
          });
        }
      }
      else{
        return
      }
    })

    
  }

}
