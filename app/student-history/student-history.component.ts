import {Component, Inject, NgZone, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {TNSFancyAlert,TNSFancyAlertButton} from 'nativescript-fancyalert';
import {Router, ActivatedRoute} from '@angular/router';
import {FirebaseService, BackendService} from '../services';
import {StudentModel} from '../models';

@Component({
    moduleId: module.id,
    selector: 'pb-student-history',
    templateUrl: 'student-history.component.html',
    styleUrls: ['student-history.css']
})
export class StudentHistoryComponent implements OnInit {

    public practices$: Observable<any>;
    studentId: any;
    private sub: any;
    userId: string;
  
    
    constructor(
        private route: ActivatedRoute,
        private firebaseService: FirebaseService,
        private router: Router,
        private ngZone: NgZone,
    ) {}

ngOnInit(){             
  this.sub = this.route.params.subscribe((params:any) => {
      this.studentId = params['id'];
      this.userId = params['userId']
      this.ngZone.run(() => {
        this.practices$ = <any>this.firebaseService.getMyPractices(this.studentId);
      })      
    });
 }

 goHome() {
    this.router.navigate([""]);
 }

 viewComment(message){
    TNSFancyAlert.showEdit('A note for you', message, 'OK!');                    
 }

 viewAward(award){
    TNSFancyAlert.showNotice('A Sticker for you!', award, 'Thanks!');                    
 }
}
