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


    console.log(" Hey Yash cehk  ")

    // $(document).ready(function () {


    //   console.log(document.getElementById('yash'))
    // });


    this.htmlContent = document.getElementById('yash');

    console.log(" Hey Yash cehk  ", this.htmlContent)





    this._timeSheetService.generatePdf(this.htmlContent).subscribe((res => {
      console.log('Res===>>', res);
    }));

  }
  // alert($("#content").html());
  // console.log('New Content', this.content);
  // let doc = new jsPDF();
  // console.log(" doc ", doc)
  // console.log(" Native Ekement ", this.content.nativeElement)
  // this.loading = true;

  // html2canvas(this.content.nativeElement)
  //   .then(function (canvas) {
  //     console.log(" Canvas ", canvas)
  //     var imgData = canvas.toDataURL(
  //       'image/png');
  //     var doc = new jsPDF('p', 'mm');
  //     doc.addImage(imgData, 'sPNG', 10, 10);
  //     doc.save('sample-file.pdf');
  //     // document.body.appendChild(canvas);
  //     console.log(" Document Body ", document.body)
  //     this.loading = false;
  //   })
  //   .catch(function (error) {
  //     console.error(" Canvas error " + error)
  //   })

  // doc.addHTML(this.content.nativeElement, function () {
  //   doc.save("obrz.pdf");
  // });
}
  // html2canvas(this.content.nativeElement).then(canvas => {
  //   console.log("CALLED");
  //   // onrendered: function(canvas: HTMLCanvasElement){
  //   let doc = new jsPDF();
  //   doc.save('web.pdf');
  //   // }



  //   // document.body.appendChild(canvas)
  // });

  // html2canvas($("#content")), {
  //   onrendered: function (canvas : HTMLCanvasElement) {
  //     console.log("CALLED");
  //     let doc = new jsPDF();
  //     doc.save('sample-file.pdf');
  //   }
  // };
  //   var specialElementHandlers = {
  //     '#editor': function (element, renderer) {
  //         return true;
  //     }
  // };
  //   var doc = new jsPDF();
  //   let data = document.getElementById('content')
  //   doc.fromHTML($('#content').html(), 15, 15, {
  //     'width': 170,
  //         'elementHandlers': specialElementHandlers
  // });
  // doc.text(20, 30, 'This is client-side Javascript, pumping out a PDF.');
  // doc.addPage();
  // doc.text(20, 20, 'Do you like that?');

  // Save the PDF



  // onrendered: function(canvas: HTMLCanvasElement) {
  //   var pdf = new jsPDF('p','pt','a4');    
  //   var img = canvas.toDataURL("image/png");
  //   pdf.addImage(img, 'PNG', 10, 10, 580, 300);
  //   pdf.save('web.pdf');
  // }


// }

// $('#print').click(function() {

//   var w = document.getElementById("content").offsetWidth;
//   var h = document.getElementById("content").offsetHeight;
//   html2canvas(document.getElementById("content"), {
//     dpi: 300, // Set to 300 DPI
//     scale: 3, // Adjusts your resolution
//     onrendered: function(canvas) {
//       var img = canvas.toDataURL("image/jpeg", 1);
//       var doc = new jsPDF('L', 'px', [w, h]);
//       doc.addImage(img, 'JPEG', 0, 0, w, h);
//       doc.save('sample-file.pdf');
//     }
//   });
// });