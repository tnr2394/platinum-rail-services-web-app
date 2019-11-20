import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  clients:any = [];
  constructor(private http: HttpClient) { 
    this.clients = [];
    console.log("clients initialized!!!!!!!",this.clients)
  }
  
  addClient(data:any): Observable<any> {
    console.log("Adding clients",data);
  
    return  new Observable<any>((observer)=>{
      console.log("Observable");
      var that = this;
      this.http.post("http://localhost:3000/clients",data).subscribe((res:any)=>{
  
      observer.next(res.data.client);
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
  editClient(data:any): Observable<any> {
    console.log("Edit clients",data);
    return  new Observable<any>((observer)=>{
      console.log("Observable");
      this.http.put("http://localhost:3000/clients",data).subscribe((res:any)=>{
        console.log("Edited Course : ",res);
        observer.next(res.data.client);
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
  
  deleteClient(id){
    return new Observable((observer)=>{
      this.http.delete("http://localhost:3000/clients?_id="+id).subscribe((res:any)=>{
        observer.next(res.data.clients);
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

  deleteLocation(id){
    return new Observable((observer)=>{
      this.http.delete("http://localhost:3000/clients/location?_id="+id).subscribe((res:any)=>{
        observer.next(res.data.clients);
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

    getClients(): Observable<any>{
      console.log("Getting clients");
      var that = this;
      return  new Observable<any>((observer)=>{
        console.log("Observable");
        this.http.get("http://localhost:3000/clients").subscribe((res:any)=>{
          console.log("Get clients : ",res);
          observer.next(res.data.clients);
          observer.complete();
        })
    
      });
    }
    getClient(id): Observable<any>{
      console.log("Getting clients");
      var that = this;
      return  new Observable<any>((observer)=>{
        console.log("Observable");
        this.http.get("http://localhost:3000/clients?_id="+id).subscribe((res:any)=>{
          console.log("Get clients : ",res);
          observer.next(res.data.clients);
          observer.complete();
        })
    
      });
    }
  
  
    addLocation(data:any): Observable<any> {
      console.log("Adding location",data);
    
      return  new Observable<any>((observer)=>{
        console.log("Observable");
        var that = this;
        this.http.post("http://localhost:3000/clients/location",data).subscribe((res:any)=>{
        console.log("Received Sending = ",res.data.location)
        observer.next(res.data.location);
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
  
    updateLocation(data:any): Observable<any> {
      console.log("Adding location",data);
    
      return  new Observable<any>((observer)=>{
        console.log("Observable");
        var that = this;
        this.http.put("http://localhost:3000/clients/location",data).subscribe((res:any)=>{
        console.log("Received Sending = ",res.data.location)
        observer.next(res.data.location);
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
  
  
  }
  