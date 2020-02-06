import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientService } from '../services/client.service';
import { Observable } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent, MatDialog } from '@angular/material';
import { AddClientModalComponent } from './add-client-modal/add-client-modal.component';
import { EditClientModalComponent } from './edit-client-modal/edit-client-modal.component';
import { FilterService } from "../services/filter.service";
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  loading: Boolean;
  clients: any = [];
  bgColors: string[];
  lastColor;
  length;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  displayedColumns: string[] = ['name', 'email', 'actions'];
  dataSource: MatTableDataSource<any>;
  paginator: MatPaginator;
  // sort: MatSort;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  // @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
  //   this.sort = ms;
  //   this.setDataSourceAttributes();
  // }
  @ViewChild(MatPaginator, { static: true }) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  constructor(public _clientService: ClientService, public dialog: MatDialog, public _filter: FilterService, public _snackBar: MatSnackBar) {
    this.bgColors = ["badge-info", "badge-success", "badge-warning", "badge-primary", "badge-danger"];
    this.clients = [];
    console.log('this.clients', this.clients);
    this.dataSource = new MatTableDataSource(this.clients);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // applyFilter(filterValue: string) {
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }
  filter(searchText) {
    console.log('FILTER CALLED', searchText);
    if (searchText === '') {
      this.dataSource = this.clients;
      this.dataSource.paginator = this.paginator;
      // this.handlePage({pageIndex:0, pageSize:this.pageSize});
      return;
    }
    this.dataSource = this._filter.filter(searchText, this.clients, ['name']);
    this.dataSource.paginator = this.paginator;
    // this.iterator();
  }

  getRandomColorClass(i) {
    var rand = Math.floor(Math.random() * this.bgColors.length);
    rand = i % 5;
    this.lastColor = rand;
    return this.bgColors[rand];
  }
  ngOnInit() {
    this.loading = true;
    this.getClients();
    
    const paginatorIntl = this.paginator._intl;
    paginatorIntl.nextPageLabel = '';
    paginatorIntl.previousPageLabel = '';
  }


  // UTILITY

  updateData(clients) {
    console.log("UPDATING DATA = ", clients)
    this.dataSource = new MatTableDataSource(clients);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log("SETTING SORT TO = ", this.dataSource.sort)
    console.log("SETTING paginator TO = ", this.dataSource.paginator)

  }



  // MODALS
  addClientModal() {
    var addedClient = this.openDialog(AddClientModalComponent).subscribe((client) => {
      console.log("Client added in controller = ", client);
      if (client == undefined) return;
      this.clients.push(client);
      this.openSnackBar("Client Added Successfully", "Ok");
      this.updateData(this.clients);
    }, err => {
      return this.openSnackBar("Client could not be Added", "Ok");
    });
  }


  editClientModal(index, data) {
    this.openDialog(EditClientModalComponent, data).subscribe((data) => {
      console.log("DIALOG CLOSED", data)
      // Handle Error
      if (!data) return;// this.openSnackBar("Client could not be edited","Ok");
      if (data.result == "err") return this.openSnackBar("Client could not be edited", "Ok");

      // EDIT HANDLE
      if (data.action == 'edit') {
        console.log("HANDLING EDIT SUCCESS", data);
        data = data;
        var Index = this.clients.findIndex(function (i) {
          return i._id === data._id;
        })
        this.clients[Index] = data.data;
        this.handleSnackBar({ msg: "Client edited successfully.", button: "Ok" });
      }
      // DELETE HANDLE
      else if (data.action == 'delete') {
        console.log("Deleted ", data);
        this.clients.splice(this.clients.findIndex(function (i) {
          return i._id === data.data._id;
        }), 1);
        this.handleSnackBar({ msg: "Client deleted successfully.", button: "Ok" });
      }
      this.updateData(this.clients);

    });
  }



  handleSnackBar(data) {
    this.openSnackBar(data.msg, data.button);
  }

  openDialog(someComponent, data = {}): Observable<any> {
    console.log("OPENDIALOG", "DATA = ", data);
    const dialogRef = this.dialog.open(someComponent, { data });
    return dialogRef.afterClosed();
  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  // API CALLS

  getClients() {
    var that = this;
    this._clientService.getClients().subscribe((clients) => {
      this.clients = clients;
      this.loading = false;
      this.updateData(clients)
    });
  }
}
