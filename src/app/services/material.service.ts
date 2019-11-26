import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  materials:any = [];
  constructor(private http: HttpClient) { 
    this.materials = [];
    console.log("materials initialized!!!!!!!",this.materials)
  }
  
  addMaterial(data:any): Observable<any> {
    console.log("Adding materials",data);
    
    return  new Observable<any>((observer)=>{
      console.log("Observable");
      var that = this;
      this.http.post("http://localhost:3000/materials",data).subscribe((res:any)=>{
      
      observer.next(res.data.material);
      // observer.complete();
    },err=>{
      console.log("ERROR ")
      observer.error(err);
    },
    ()=>{
      console.log("CALL COMPLETED ")
      observer.complete();
    })
    
  });
  
}
editMaterial(data:any): Observable<any> {
  console.log("Edit materials",data);
  return  new Observable<any>((observer)=>{
    console.log("Observable");
    this.http.put("http://localhost:3000/materials",data).subscribe((res:any)=>{
    console.log("Edited Material : ",res);
    observer.next(res.data.material);
    // observer.complete();
  },err=>{
    console.log("ERROR ")
    observer.error(err);
  },
  ()=>{
    console.log("CALL COMPLETED ")
    observer.complete();
  })
});

}

deleteMaterial(id){
  return new Observable((observer)=>{
    this.http.delete("http://localhost:3000/materials?_id="+id).subscribe((res:any)=>{
    console.log("Deleted Material Response in service = ",res);
    observer.next(res.data.material);
    // observer.complete();
  },err=>{
    console.log("ERROR ")
    observer.error(err);
  },
  ()=>{
    console.log("CALL COMPLETED ")
    observer.complete();
  });
  
})
}

getMaterial(id): Observable<any>{
  console.log("Getting materials");
  var that = this;
  return  new Observable<any>((observer)=>{
    console.log("Observable");
    this.http.get("http://localhost:3000/materials?_id="+id).subscribe((res:any)=>{
    console.log("Get materials : ",res);
    observer.next(res.data.materials);
    observer.complete();
  })
  
});
}

getmaterialsByCourseId(jobId): Observable<any>{
  console.log("Getting materials");
  var that = this;
  return  new Observable<any>((observer)=>{
    console.log("Observable");
    this.http.get("http://localhost:3000/materials?job="+jobId).subscribe((res:any)=>{
    console.log("Get materials : ",res);
    observer.next(res.data.materials);
    observer.complete();
  })
  
});
}


}
