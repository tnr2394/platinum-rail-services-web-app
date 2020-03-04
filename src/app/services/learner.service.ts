import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { config } from '../config';

@Injectable({
  providedIn: 'root'
})
export class LearnerService {
  learners: any = [];

  @Output() isSelected: EventEmitter<any> = new EventEmitter<any>();


  constructor(private http: HttpClient) {
    this.learners = [];
    console.log("learners initialized!!!!!!!", this.learners)
  }

  addLearner(data: any): Observable<any> {
    console.log("Adding learners", data);

    return new Observable<any>((observer) => {
      console.log("Observable");
      var that = this;
      this.http.post(config.baseApiUrl + "learners", data).subscribe((res: any) => {

        observer.next(res.data.learner);
        // observer.complete();
      }, err => {
        console.log("ERROR ", err)
        observer.error(err.msg);
      },
        () => {
          console.log("CALL COMPLETED ")
          observer.complete();
        })

    });

  }
  editLearner(data: any): Observable<any> {
    console.log("Edit learners", data);
    return new Observable<any>((observer) => {
      console.log("Observable");
      this.http.put(config.baseApiUrl + "learners", data).subscribe((res: any) => {
        console.log("Edited Learner : ", res);
        observer.next(res.data.learner);
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


  allocateLearner(data: any): Observable<any> {
    console.log("Edit learners", data);
    return new Observable<any>((observer) => {
      console.log("Observable");
      this.http.post(config.baseApiUrl + "learners/allot", data).subscribe((res: any) => {
        console.log("Edited Learner : ", res);
        observer.next(res);
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
  allocateLearnerFromStatus(data: any): Observable<any> {
    console.log("ALLOTMENT", data);
    return new Observable<any>((observer) => {
      console.log("Observable");
      this.http.post(config.baseApiUrl + "learners/allotment", data).subscribe((res: any) => {
        console.log("alloted : ", res);
        observer.next(res);
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

  submitExamMarks(data: any): Observable<any> {
    console.log("submit Marks learners", data);
    return new Observable<any>((observer) => {
      console.log("Observable");
      this.http.post(config.baseApiUrl + "learners/exam", data).subscribe((res: any) => {
        console.log("Edited Learner : ", res);
        observer.next(res.data.learner);
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

  getAllotedLearnerFilesUsingAllotmentId(id) {
    return new Observable<any>((observer) => {
      console.log("Observable");
      this.http.get(config.baseApiUrl + "learners/allot?_id=" + id).subscribe((res: any) => {
        console.log("----------Alloted Learner data---------- : ", res);
        observer.next(res.data.allotment);
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



  getAllotedLearnerFiles(learnerId, assignmentId) {
    return new Observable<any>((observer) => {
      console.log("Observable");
      this.http.get(config.baseApiUrl + "learners/allot", learnerId + assignmentId).subscribe((res: any) => {
        console.log("----------Alloted Learner data---------- : ", res);
        observer.next(res.data.learner);
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

  deleteLearner(id) {
    return new Observable((observer) => {
      this.http.delete(config.baseApiUrl + "learners?_id=" + id).subscribe((res: any) => {
        observer.next(res.data.learner);
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

  getLearner(id): Observable<any> {
    console.log("Getting learners");
    var that = this;
    return new Observable<any>((observer) => {
      console.log("Observable");
      this.http.get(config.baseApiUrl + "learners?_id=" + id).subscribe((res: any) => {
        console.log("Get learners : ", res);
        observer.next(res.data.learners);
        observer.complete();
      })
    });
  }


  getLearnersByJobId(jobId): Observable<any> {
    console.log("Getting learners");
    var that = this;
    return new Observable<any>((observer) => {
      console.log("Observable");
      this.http.get(config.baseApiUrl + "learners?job=" + jobId).subscribe((res: any) => {
        observer.next(res.data.learners);
        observer.complete();
      })

    });
  }

  getAllotmentListUsingAssignmentId(assignmentId): Observable<any> {
    console.log("Getting learners");
    var that = this;
    return new Observable<any>((observer) => {
      console.log("Observable");
      this.http.get(config.baseApiUrl + "learners/allot-status?_id=" + assignmentId).subscribe((res: any) => {
        console.log("Get learners : ", res);
        observer.next(res.data.assignment);
        observer.complete();
      })

    });
  }


  submitAssignment(data: any): Observable<any> {
    console.log("Adding Files", data);

    return new Observable<any>((observer) => {
      console.log("Observable");
      var that = this;
      this.http.post(config.baseApiUrl + "learners/submission", data).subscribe((res: any) => {

        observer.next(res.data.file);
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

  updateAssignmentAllotmentUsingAllotmentId(data: any): Observable<any> {
    console.log("Adding Files", data);

    return new Observable<any>((observer) => {
      console.log("Observable");
      var that = this;
      this.http.put(config.baseApiUrl + "learners/allot", data).subscribe((res: any) => {

        observer.next(res.data.file);
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

  isChecked() {
    console.log('Is checked From Service');
    this.isSelected.emit('false');
  }


}
