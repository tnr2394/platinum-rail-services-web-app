import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {ClientService} from '../../services/client.service';
@Component({
  selector: 'app-single-client',
  templateUrl: './single-client.component.html',
  styleUrls: ['./single-client.component.scss']
})
export class SingleClientComponent implements OnInit {
  client;
  constructor(private activatedRoute: ActivatedRoute, private _clientService: ClientService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params=>{
      console.log(params['id']);
      this._clientService.getClient(params['id']).subscribe(data=> this.client = data);
    })    
  }

}
