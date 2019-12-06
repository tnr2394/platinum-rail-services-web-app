import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { config } from '../config';


@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  materials: any = [];
  constructor(private http: HttpClient) {
    this.materials = [];
    console.log("materials initialized!!!!!!!", this.materials)
  }

  addMaterial(data: any): Observable<any> {
    console.log("Adding materials", data);

    return new Observable<any>((observer) => {
      console.log("Observable");
      var that = this;
      this.http.post(config.baseApiUrl + "materials", data).subscribe((res: any) => {

        observer.next(res.data.material);
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
  editMaterial(data: any): Observable<any> {
    console.log("Edit materials", data);
    return new Observable<any>((observer) => {
      console.log("Observable");
      this.http.put(config.baseApiUrl + "materials", data).subscribe((res: any) => {
        console.log("Edited Material : ", res);
        observer.next(res.data.material);
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

  deleteMaterial(id) {
    return new Observable((observer) => {
      this.http.delete(config.baseApiUrl + "materials?_id=" + id).subscribe((res: any) => {
        console.log("Deleted Material Response in service = ", res);
        observer.next(res.data.material);
        // observer.complete();
      }, err => {
        console.log("ERROR ")
        observer.error(err);
      },
        () => {
          console.log("CALL COMPLETED ")
          observer.complete();
        });

    })
  }

  getMaterial(id): Observable<any> {
    console.log("Getting materials");
    var that = this;
    return new Observable<any>((observer) => {
      console.log("Observable");
      this.http.get(config.baseApiUrl + "materials?_id=" + id).subscribe((res: any) => {
        console.log("Get materials : ", res);
        observer.next(res.data.materials);
        observer.complete();
      })

    });
  }

  getAllMaterials():Observable<any>{
    console.log("Getting all the materials")
    var that = this;
    return new Observable<any>((observer) => {
      console.log("Observable");
      this.http.get(config.baseApiUrl + "materials").subscribe((res: any) => {
        console.log("Get materials : ", res);
        observer.next(res.data);
        observer.complete();
      })
    });
  }

  getmaterialsByCourseId(jobId): Observable<any> {
    console.log("Getting materials");
    var that = this;
    return new Observable<any>((observer) => {
      console.log("Observable");
      this.http.get(config.baseApiUrl + "materials?job=" + jobId).subscribe((res: any) => {
        console.log("Get materials : ", res);
        observer.next(res.data.materials);
        observer.complete();
      })

    });
  }


}
