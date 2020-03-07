import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { config } from '../config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompetenciesService {

  constructor(private http: HttpClient) { }

  addCompetency(data: any): Observable<any> {
    console.log("Adding Competency", data);

    return new Observable<any>((observer) => {
      console.log("Observable");
      var that = this;
      this.http.post(config.baseApiUrl + "competencies", data).subscribe((res: any) => {
        observer.next(res.data);
        // observer.complete();
      }, err => {
        console.log("ERROR ")
        observer.error(err);
      },
        () => {
          console.log("CALL COMPLETED ")
          observer.complete();
        })

    });

  }
  getCompetencies(id: any): Observable<any> {
    console.log("Getting Competency", id);

    return new Observable<any>((observer) => {
      console.log("Observable");
      var that = this;
      this.http.get(config.baseApiUrl + "competencies?_id=" + id).subscribe((res: any) => {
        observer.next(res.data);
        // observer.complete();
      }, err => {
        console.log("ERROR ")
        observer.error(err);
      },
        () => {
          console.log("CALL COMPLETED ")
          observer.complete();
        })

    });

  }
}