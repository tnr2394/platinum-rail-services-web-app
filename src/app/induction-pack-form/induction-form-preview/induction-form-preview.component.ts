import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-induction-form-preview',
  templateUrl: './induction-form-preview.component.html',
  styleUrls: ['./induction-form-preview.component.scss']
})
export class InductionFormPreviewComponent implements OnInit {

  data: any;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.data = this.router.getCurrentNavigation().extras.state.data;
    });

    console.log('data in preview====>>>', this.data);
  }

  ngOnInit() {
  }

}
