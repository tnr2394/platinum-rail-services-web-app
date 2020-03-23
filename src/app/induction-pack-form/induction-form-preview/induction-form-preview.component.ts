import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
declare var $: any;
import { TimeSheetService } from '../../services/time-sheet.service';



@Component({
  selector: 'app-induction-form-preview',
  templateUrl: './induction-form-preview.component.html',
  styleUrls: ['./induction-form-preview.component.scss']
})
export class InductionFormPreviewComponent implements OnInit {

  data: any;
  loading: Boolean = false;
  htmlContent: any;

  shortDate;

  @ViewChild('content', { static: false }) content: ElementRef;


  constructor(public _timeSheetService: TimeSheetService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.data = this.router.getCurrentNavigation().extras.state.data;
    });

    console.log('data in preview====>>>', this.data);
  }

  ngOnInit() {
    // this.makePdf();
  }

  makePdf() {
    this._timeSheetService.generatePdf(this.data).subscribe((res => {
      console.log('Res===>>', res);
    }));
  }
}