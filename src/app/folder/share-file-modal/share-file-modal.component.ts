import { Component, OnInit } from '@angular/core';
import { InstructorService } from '../../services/instructor.service';
import { ClientService } from '../../services/client.service';
import { MatDialogRef } from '@angular/material';
import { runInThisContext } from 'vm';

@Component({
  selector: 'app-share-file-modal',
  templateUrl: './share-file-modal.component.html',
  styleUrls: ['./share-file-modal.component.scss']
})
export class ShareFileModalComponent implements OnInit {

  constructor(public _instructorService: InstructorService, public _clientService: ClientService,
    public dialogRef: MatDialogRef<ShareFileModalComponent>) { }

  instructors;
  clients;
  searchText;
  selectedInstructors = [];
  selectedClients = [];
  loading;
  filter;

  ngOnInit() {
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
      selectedClients: this.selectedClients
    };
    this.dialogRef.close(selectedUsers)
  }



  // API CALLS
  getInstructors() {
    this._instructorService.getInstructors().subscribe(instructors => {
      this.instructors = instructors;
    });
  }
  getClients() {
    this._clientService.getClients().subscribe(clients => {
      this.clients = clients;
    })

  }

}
