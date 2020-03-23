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
  isPresent: any;
  isPresentClient: boolean;

  constructor(public _instructorService: InstructorService, public _clientService: ClientService, public _folderService: FolderService,
    public dialogRef: MatDialogRef<ShareFileModalComponent>, @Inject(MAT_DIALOG_DATA) public dialogdata: any) { }

  instructors;
  clients;
  searchText;
  selectedInstructors = [];
  selectedClients = [];
  selInstructor = [];
  alreadySharedInstructor = [];
  alreadySharedClient = [];
  loading;
  filter;
  data;

  ngOnInit() {
    console.log("DATA IN Share File::::::::: = ", this.dialogdata);
    this.alreadySharedInstructor = this.dialogdata.inst;
    if(this.alreadySharedInstructor.length > 0){
      this.isPresent = true
      
      // this.filterIns()
    }
    else this.isPresent = false
    this.alreadySharedClient = this.dialogdata.client;
    if (this.alreadySharedClient.length > 0) {
      this.isPresentClient = true
      // this.filterIns()
    }
    else this.isPresentClient = false

    console.log('Already Exists::::', this.alreadySharedClient, this.alreadySharedInstructor)
    console.log("this.isPresent", this.isPresent, "this.isPresentClient", this.isPresentClient);
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
    console.log('dialogdata:::::::::::', this.dialogdata);
    let selectedUsers = {
      selectedInstructors: this.selectedInstructors,
      selectedClients: this.selectedClients,
      alreadySharedInstructor: this.alreadySharedInstructor,
      alreadySharedClient: this.alreadySharedClient,
      file: this.dialogdata
    };
    // if (this.dialogdata.type == 'folder') {
    //   this._folderService.shareFolder(selectedUsers).subscribe(res => {
    //     console.log("shareFolder response", res);
    //     this.dialogRef.close(selectedUsers)
    //   })
    // }
    // else {
    //   this._folderService.shareFile(selectedUsers).subscribe(res => {
    //     console.log("shareFile response", res);
    //     this.dialogRef.close(selectedUsers)
    //   })
    // }
    this.dialogRef.close(selectedUsers)
  }

  filterIns() {
    let data = []
    data = this.dialogdata.data.sharedInstructor;
    if(this.isPresent){ data = this.dialogdata.inst }
    console.log("filterIns called")
    if(this.instructors.length > 0){
      this.instructors.forEach((e1) => data.forEach((e2) => {
        if (e1._id == e2._id) {
          this.selectedInstructors.push(e1);
          e1.checked = true;
          console.log("this.selectedInstructors in filterIns", this.selectedInstructors);
        }
      }));
    }
  }

  filterClient() {
    let data = []
    if (this.isPresentClient) { data = this.dialogdata.client }
    else data = this.dialogdata.data.sharedClient;
    if (this.clients.length > 0) {
      console.log("IN if this.clients", this.clients, "data", data)
      this.clients.forEach((e1) => data.forEach((e2) => {
        if (e1._id == e2._id) {
          this.selectedClients.push(e1);
          e1.checked = true;
        }
      }));
    }
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
      console.log("this.clients", this.clients);
      clients.forEach((client) => {
        client.checked = false;
      })
      this.filterClient();
    })

  }

}
