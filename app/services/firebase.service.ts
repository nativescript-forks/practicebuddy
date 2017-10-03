import { Injectable, Inject, NgZone } from '@angular/core';
import firebase = require("nativescript-plugin-firebase");
import { LoadingIndicator } from "nativescript-loading-indicator";
import * as appSettings from 'application-settings';
//import { RouterExtensions } from 'nativescript-angular/router';
import { UtilsService, BackendService } from '../services';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
//import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/find';
import { UserModel, StudentModel, PracticeModel } from '../models';
import {TNSFancyAlert,TNSFancyAlertButton} from 'nativescript-fancyalert';

@Injectable()
export class FirebaseService {

  constructor(
    private ngZone: NgZone
  ) { }

  items: BehaviorSubject<Array<StudentModel>> = new BehaviorSubject([]);
  practiceitems: BehaviorSubject<Array<PracticeModel>> = new BehaviorSubject([]);
  teacherstudentsitems: BehaviorSubject<Array<StudentModel>> = new BehaviorSubject([]);
  practicearchiveitems: BehaviorSubject<Array<PracticeModel>> = new BehaviorSubject([]);

  loader = new LoadingIndicator();

  private _allItems: Array<StudentModel> = [];
  private _allPracticeItems: Array<PracticeModel> = [];
  private _allTeacherStudentsItems: Array<StudentModel> = [];
  private _allPracticeArchiveItems: Array<PracticeModel> = [];

  register(user: UserModel) {
    return firebase.createUser({
      email: user.email,
      password: user.password
    }).then((result: any) => {
      //create a collection with an email and date. This can be the teacher's email
      return firebase.update(
        "/Users/"+BackendService.token,
        {
          "Email": user.email,
          "Date": 0 - Date.now()
        }
      ).then(
        function (result: any) {
          console.log(result)
          return 'User added!';
        },
        function (errorMessage: any) {
          console.log(errorMessage);
        });
      })
  }

  login(user: UserModel) {
    this.loader.show({ message: 'Logging in...' });
    return firebase.login({
      type: firebase.LoginType.PASSWORD,
      passwordOptions: {
        email: user.email,
        password: user.password
      }
    }).then((result: any) => {
      this.loader.hide();
      BackendService.token = result.uid;
      BackendService.email = result.email;
      return JSON.stringify(result);
    }, (errorMessage: any) => {
      this.loader.hide();
      TNSFancyAlert.showError('Oops!', JSON.stringify(errorMessage), 'OK!');      
    });
  }

  logout() {
    BackendService.invalidateToken();
    firebase.logout();
  }

  resetPassword(email) {
    return firebase.resetPassword({
      email: email
    }).then((result: any) => {
      return 'Please check your email for the password reset instructions';
    },
      function (errorMessage: any) {
        TNSFancyAlert.showError('Oops!', JSON.stringify(errorMessage), 'OK!');              
      }
      ).catch(this.handleErrors);
  }

  //end user settings

  public getMyStudents(): Observable<any> {

    //this gets the students associated to the account
    return new Observable((observer: any) => {
      let path = '/Users/'+BackendService.token;
      console.log(path)
      let listener: any;

      this.loader.show({ message: 'Finding my Students...' });

      let onValueEvent = (snapshot: any) => {
        this.ngZone.run(() => {
          let results = this.handleSnapshot(snapshot.value);
          observer.next(results);
          this.loader.hide();
        });
      };

      firebase.addValueEventListener(onValueEvent, `/${path}`);
    }).share();
  }
  
  public add(name: string) {
    return firebase.push(
      "/Users/"+BackendService.token+"",
      {
        "Email": BackendService.email,
        "Name": name,
        "Date": 0 - Date.now(),
        "PracticesRequired": 5,
        "PracticesCompleted": 0,
        "PracticeLength": 20,
        "Reward": "A special prize!",
        "AdminPassword": "",
        "TeacherId": "",
        "TeacherEmail": "",
        "Instrument": 10,
        "NotifyAll": false
      }
    ).then(
      function (result: any) {
        return 'Student added!';
      },
      function (errorMessage: any) {
        console.log(JSON.stringify(errorMessage));
      });
  }

  public getMyStudent(id: string): Observable<any> {
    return new Observable((observer: any) => {
      observer.next(this._allItems.filter(s => s.id === id)[0]);
    }).share();
  }

  public saveRecording(localPath: string, file?: any): Promise<any> {
    let filename = UtilsService.getFilename(localPath);
    let remotePath = `${filename}`;
    return firebase.uploadFile({
      remoteFullPath: remotePath,
      localFullPath: localPath,
      onProgress: function(status) {
        //this.loader.show({ message: "Percentage complete: " + status.percentageCompleted });
      }
    });
  }

  public deleteStudent(id: string) {
    return firebase.remove("/Users/"+BackendService.token+"/"+id+"")
      .then(
      //this.publishUpdates()
      )
      .catch(this.handleErrors);
  }

  public addPracticeTrack(id: string, track: string) {
    this.publishUpdates();
    return firebase.update("/Practices/"+id+"", { Track: track })
      .then(
      function (result: any) {
        return 'Practice track added!';
      },
      function (errorMessage: any) {
        console.log(errorMessage);
      });
  }

  public getDownloadUrl(remoteFilePath: string): Promise<any> {
    return firebase.getDownloadUrl({
      remoteFullPath: remoteFilePath
    })
      .then(
      function (url: string) {
        return url;
      },
      function (errorMessage: any) {
        console.log(errorMessage);
      });
  }

  public writePractice(id: string, name: string, practicelength: number, track: string) {
    this.publishUpdates();
    return firebase.push("/Practices/"+id, { Name: name, Date: firebase.ServerValue.TIMESTAMP, PracticeLength: practicelength, Track: track })
      /*
      //keep a reference of the student's practices under the person who practiced
      .then(
        function(result: any){
          return firebase.push("/Users/"+userId+"/" + id + "/Practices/",{PracticeId: result.key})
        }
      )*/
      .then(
      function (result: any) {
        return result;
      },
      function (errorMessage: any) {
        console.log(errorMessage);
      });
  }
  public clearPracticesCompleted(userId: string, id: string) {
    //sets practices to zero
    this.publishUpdates();
    return firebase.update("/Users/" + userId + "/" + id + "", { PracticesCompleted: 0 })
      .then(
      function (result: any) {
        return 'Congratulations! You completed a practice goal!';
      },
      function (errorMessage: any) {
        console.log(errorMessage);
      });
  }

  public incrementPracticesCompleted(userId: string, id: string, currPracticesCompleted: number) {
    this.publishUpdates();
    return firebase.update("/Users/" + userId + "/" + id + "",  { PracticesCompleted: currPracticesCompleted })
      .then(
      function (result: any) {
        return 'Student information saved!';
      },
      function (errorMessage: any) {
        console.log(errorMessage);
      });
  }

  //teacher 
  public getTeacherStudents(): Observable<any> {
    //this gets the students associated to the account
    return new Observable((observer: any) => {
      let path = 'StudentSettings';
      let listener: any;

      this.loader.show({ message: 'Finding My Students...' });

      let onValueEvent = (snapshot: any) => {
        this.ngZone.run(() => {
          let results = this.handleTeacherStudentsSnapshot(snapshot.value);
          observer.next(results);
          this.loader.hide();
        });
      };
      firebase.addValueEventListener(onValueEvent, `/${path}`).then(() => {
        //this.loader.hide();
      });
    }).share();
  }

  //teacher student home
  public getMyPractices(id:string): Observable<any> {
    //this gets the practices associated to a student
    return new Observable((observer: any) => {
      let path = '/Practices/'+id+"";
      console.log(path)
      let listener: any;          
        this.loader.show({ message: 'Finding Practices...' });

        let onValueEvent = (snapshot: any) => {
          this.ngZone.run(() => {
            
              let results = this.handlePracticeSnapshot(snapshot.value, path);
              observer.next(results);
            
          });
        };

        firebase.addValueEventListener(onValueEvent, `/${path}`).then(() => {
          //this.loader.hide();
        });        
    }).share();
  }

  public addComment(id:string, comment: string){
    this.publishUpdates();
    return firebase.update("/Practices/"+id+"",{Comment: comment})
      .then(
        function (result:any) {
          return 'Practice Commented!';
        },
        function (errorMessage:any) {
          console.log(errorMessage);
        });  
  }

  public markComplete(id:string){
    this.publishUpdates();
    return firebase.update("/Practices/"+id+"",{Archive: true})
      .then(
        function (result:any) {
          return 'Practice Archived!';
        },
        function (errorMessage:any) {
          console.log(errorMessage);
        });  
  }

  //settings 
  public saveSettings(student: StudentModel){
    this.publishUpdates();
    this.lookUpTeacher(student.TeacherEmail,student.id);
    return firebase.update("/Users/"+BackendService.token+"/"+student.id+"",{Name:student.Name, Instrument:student.Instrument, AdminPassword:student.AdminPassword, PracticesRequired:student.PracticesRequired, PracticeLength:student.PracticeLength, Reward:student.Reward, TeacherEmail:student.TeacherEmail, NotifyAll:student.NotifyAll})
      .then(
        function (result:any) {
          return 'Student information saved!';          
        },
        function (errorMessage:any) {
          console.log(errorMessage);
        });  
  }

  lookUpTeacher(email,studentId){
    var onQueryEvent = function(result) {
      if (!result.error) {
        for (let id in result.value) {
          // Get the object based on the id 
          console.log(id)
          //update student with teacher id
          return firebase.update(
            "/Users/"+BackendService.token+"/"+studentId,
            {
              "TeacherId": id,
            }
          ).then(
            function (result: any) {
              console.log(result)
              return 'User added!';
            },
            function (errorMessage: any) {
              console.log(errorMessage);
            });
          }          
      }
  };

  firebase.query(
      onQueryEvent,
      "/Users",
      {
        singleEvent: true,
        orderBy: {
          type: firebase.QueryOrderByType.CHILD,
          value: 'Email'
        },
        range: {
          type: firebase.QueryRangeType.EQUAL_TO,
          value: email
        }         
      }
  );
  }

   //stickers
  public addAward(id:string, stickerId: number){
    this.publishUpdates();
    return firebase.update("/Practices/"+id+"",{Sticker: stickerId})
      .then(
        function (result:any) {
          return 'Sticker Added!';
        },
        function (errorMessage:any) {
          console.log(errorMessage);
        });  
  }

  //teacher student archive 

  public getArchivedPractices(): Observable<any> {
    //this gets the practices associated to a teacher
    return new Observable((observer: any) => {
      let path = 'Practices';
      let listener: any;
          
        this.loader.show({ message: 'Finding Practices...' });
          
        let onValueEvent = (snapshot: any) => {
          this.ngZone.run(() => {
            let results = this.handlePracticeArchiveSnapshot(snapshot.value, path);
             observer.next(results);
          });
        };

        firebase.addValueEventListener(onValueEvent, `/${path}`).then(() => {
          //this.loader.hide();
        });
    }).share();
  }

  //utilities

  handleSnapshot(data: any) {
    this._allItems = [];
    if (data) {
      for (let id in data) {
        let result = (<any>Object).assign({ id: id }, data[id]);
        //only display if there is a name for this student
        if (result.Name) {
          this._allItems.push(result);
        }
      }
      this.publishUpdates();
    }
    return this._allItems;
  }

  handleTeacherStudentsSnapshot(data: any) {
    this._allTeacherStudentsItems = [];
      if (data) {
        for (let id in data) {
          let result = (<any>Object).assign({ id: id }, data[id]);
          if (BackendService.email === result.TeacherEmail) {
            this._allTeacherStudentsItems.push(result);
          }
        }
        this.publishTeacherStudentsUpdates();
      }
    return this._allTeacherStudentsItems;
  }

  handlePracticeSnapshot(data: any, path?: string) {
    this._allPracticeItems = [];
    if (path)
    if (data) {
      for (let id in data) {
        let result = (<any>Object).assign({id: id}, data[id]);        
          this._allPracticeItems.push(result);    
        
      }
      this.publishPracticeUpdates();
    }
    else {
      this.loader.hide();
      TNSFancyAlert.showError('Oops!', 'Looks like there are no practices recorded yet!', 'OK!');      
      
    }
    return this._allPracticeItems;
  }

  handlePracticeArchiveSnapshot(data: any, path?: string) {
    //empty array, then refill
    this._allPracticeArchiveItems = [];
    if (path)
    if (data) {
      for (let id in data) {
        let result = (<any>Object).assign({id: id}, data[id]);
        if(BackendService.email === result.TeacherEmail && result.Archive){
            this._allPracticeArchiveItems.push(result);
        }
      }
      this.publishPracticeArchiveUpdates();
    }
    else {
      this.loader.hide();
      TNSFancyAlert.showError('Oops!', 'Looks like there are no practices recorded yet!', 'OK!');      
    }
    return this._allPracticeArchiveItems;
  }

  publishUpdates() {
    this._allItems.sort(function (a, b) {
      if (a.Date < b.Date) return -1;
      if (a.Date > b.Date) return 1;
      return 0;
    })
    this.items.next([...this._allItems]);
    this.loader.hide();
  }

  publishTeacherStudentsUpdates() {
    this._allTeacherStudentsItems.sort(function (a, b) {
      if (a.Date < b.Date) return -1;
      if (a.Date > b.Date) return 1;
      return 0;
    })
    this.teacherstudentsitems.next([...this._allTeacherStudentsItems]);
    this.loader.hide();
  }

  publishPracticeUpdates() {
    this._allPracticeItems.sort(function(a, b){
        if(a.Date > b.Date) return -1;
        if(a.Date < b.Date) return 1;
      return 0;
    })
    this.practiceitems.next([...this._allPracticeItems]);
    this.loader.hide();
  }

  publishPracticeArchiveUpdates() {
    this._allPracticeArchiveItems.sort(function(a, b){
        if(a.Date > b.Date) return -1;
        if(a.Date < b.Date) return 1;
      return 0;
    })
    this.practicearchiveitems.next([...this._allPracticeArchiveItems]);
    this.loader.hide();
  }

  handleErrors(error) {
    console.log(JSON.stringify(error));
    return Promise.reject(error.message);
  }
}