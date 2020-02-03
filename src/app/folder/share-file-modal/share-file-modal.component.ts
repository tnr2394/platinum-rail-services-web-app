import { Component, OnInit, Input, SimpleChanges, Inject } from '@angular/core';
import { InstructorService } from '../../services/instructor.service';
import { ClientService } from '../../services/client.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { runInThisContext } from 'vm';
import { flash } from 'ng-animate';
import { single } from 'rxjs/operators';
import { FolderService } from 'src/app/services/folder.service';

@Component({
  selector: 'app-share-file-modal',
  templateUrl: './share-file-modal.component.html',
  styleUrls: ['./share-file-modal.component.scss']
})
export class ShareFileModalComponent implements OnInit {
  @Input('details') recievedFile;

  constructor(public _instructorService: InstructorService, public _clientService: ClientService, public _folderService : FolderService,
    public dialogRef: MatDialogRef<ShareFileModalComponent>, @Inject(MAT_DIALOG_DATA) public dialogdata: any) { }

  instructors;
  clients;
  searchText;
  selectedInstructors = [];
  selectedClients = [];
  selInstructor = [];
  loading;
  filter;
  data;

  ngOnInit() {
    console.log("DATA IN Share File::::::::: = ", this.dialogdata);
    this.getInstructors();
    this.getClients();
  }

  onInstructorChange(event) {
    console.log(event);
    if (event.checked == true) {
      this.selectedInstructors.push(event.source.value)
    }
    else if (event.checked == false) {
      this.selectedInstructors.forEach((learner) => {
        if (learner._id == event.source.value._id) {
          this.selectedInstructors.splice(learner, 1)
        }
      })
    }
  }

  onClientChange(event) {
    console.log(event);
    if (event.checked == true) {
      this.selectedClients.push(event.source.value)
    }
    else if (event.checked == false) {
      this.selectedClients.forEach((learner) => {
        if (learner._id == event.source.value._id) {
          this.selectedClients.splice(learner, 1)
        }
      })
    }
  }

  share() {
    console.log("SELECTED INSTRUCTORS", this.selectedInstructors);
    console.log("SELECTED Clients", this.selectedClients);
    let selectedUsers = {
      selectedInstructors: this.selectedInstructors,
      selectedClients: this.selectedClients,
      file: this.dialogdata._id
    };
    if (this.dialogdata.type == 'folder'){
      this._folderService.shareFolder(selectedUsers).subscribe(res=>{
        console.log("RES", res);
      })
    }
    else {
      this._folderService.shareFile(selectedUsers).subscribe(res => {
        console.log("RES", res);
      })
    }
    this.dialogRef.close(selectedUsers)
  }

  filterIns() {
    this.instructors.forEach((e1) => this.dialogdata.sharedInstructor.forEach((e2) => {
      if (e1._id == e2._id) {
        this.selectedInstructors.push(e1);
        e1.checked = true;
      }
    }));
  }

  filterClient() {
    this.clients.forEach((e1) => this.dialogdata.sharedClient.forEach((e2) => {
      if (e1._id == e2._id) {
        this.selectedClients.push(e1);
        e1.checked = true;
      }
    }));
  }

  // API CALLS
  getInstructors() {
    this._instructorService.getInstructors().subscribe(instructors => {
      instructors.forEach((ins) => {
        ins.checked = false;
      })
      this.instructors = instructors;
      this.filterIns();
    });
  }

  getClients() {
    this._clientService.getClients().subscribe(clients => {
      this.clients = clients;
      clients.forEach((client) => {
        client.checked = false;
      })
      this.filterClient();
    })

  }

}
