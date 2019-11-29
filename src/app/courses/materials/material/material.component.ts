import { Component, OnInit, Input } from '@angular/core';
import { MaterialService } from '../../../services/material.service'
@Component({
  selector: 'learner-submission',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss']
})
export class MaterialComponent implements OnInit {
  @Input('materialId') materialId: any;

  constructor(public _materialService: MaterialService) { }

  ngOnInit() {

  }

}
