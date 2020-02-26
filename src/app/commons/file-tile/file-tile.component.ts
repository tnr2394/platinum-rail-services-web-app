import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileService } from 'src/app/services/file.service';
import { from, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteConfirmModalComponent } from '../delete-confirm-modal/delete-confirm-modal.component';
import { MatDialog, MatSnackBar } from '@angular/material';
declare var $: any;
@Component({
  selector: 'file-tile',
  templateUrl: './file-tile.component.html',
  styleUrls: ['./file-tile.component.scss']
})
export class FileTileComponent implements OnInit {




  @Input('file') file: any;
  @Output() deletedFile: EventEmitter<any> = new EventEmitter<any>();
  @Output() getFiles: EventEmitter<any> = new EventEmitter<any>();
  @Output() openSideNav: EventEmitter<any> = new EventEmitter<any>();
  loading: boolean;

  isSubmission;
  ismyDocs: boolean;

  constructor(public _fileService: FileService, private route: ActivatedRoute, public router: Router,
    public dialog: MatDialog, public _snackBar: MatSnackBar) { //|| this.router.url.includes('single-folder')
    if (this.router.url.includes('submission') || this.router.url.includes('learnerAllotment')) {
      this.isSubmission = true;
    } else {
      this.isSubmission = false;
    }
    if (this.router.url.includes('jobs') || this.router.url.includes('materials')){
      this.ismyDocs = false
    }
    else this.ismyDocs = true;
    // if ()
  }

  ngOnInit() {
    console.log("file tile initialized file= ", this.file);

    this.file.alias = (this.file.alias && this.file.alias.length > 1) ? this.file.alias : this.file.title

    console.log(' this.isSubmission', this.isSubmission);
  }

  openDialog(someComponent, data = {}): Observable<any> {
    console.log('OPENDIALOG', 'DATA = ', data)
    const dialogRef = this.dialog.open(someComponent, { data: 'file' });

    return dialogRef.afterClosed();
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }


  delete() {
    this.openDialog(DeleteConfirmModalComponent).subscribe(confirm => {
      console.log("CONFIRM", confirm);
      if (confirm == '') return
      else if (confirm == 'yes') {
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
      else {
        return
      }
    })
  }

  fileDetails(){
    $('.parent_row').addClass('col-width-class');
    console.log("file tile clicked", event);
    this.openSideNav.emit({ file: this.file })
  }

}
