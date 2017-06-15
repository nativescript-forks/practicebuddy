import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptAnimationsModule } from "nativescript-angular/animations";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { authProviders, appRoutes } from "./app.routes";
import { AppComponent } from "./app.component";
import { FirebaseService, UtilsService, BackendService } from "./services";

import { LoginModule } from "./login/login.module";
import { HomeModule } from "./home/home.module";
import { StudentHomeModule } from "./student-home/student-home.module";
import { StudentHistoryModule } from "./student-history/student-history.module";
import { StudentAdminModule } from "./student-admin/student-admin.module";

import { TeacherHomeModule } from "./teacher-home/teacher-home.module";
import { TeacherStudentHomeModule } from "./teacher-student-home/teacher-student-home.module";
import { TeacherStudentArchiveModule } from "./teacher-student-archive/teacher-student-archive.module";

import { StickerGalleryModule } from "./sticker-gallery/sticker-gallery.module";

import { uptime, time } from "tns-core-modules/profiling";
const dialogs = require("ui/dialogs");
import firebase = require("nativescript-plugin-firebase");
import application = require("application");

application.on("displayed", () => {
  var now = time();
  var started = now - uptime();
  console.log("Timeline: Startup time...  (" + started + "ms. - " + now + "ms.)");
});

 firebase.init({
   persist: false,
   storageBucket: 'gs://practicebuddy-4d466.appspot.com',
   onAuthStateChanged: (data: any) => {     
     if (data.loggedIn) {
       BackendService.token = data.user.uid;
     }
     else {
       BackendService.token = "";
     }
   }
 }).then(
     function (instance) {
       console.log("firebase.init done");
     },
     function (error) {
       console.log("firebase.init error: " + error);
     }
 );

@NgModule({
  providers: [
    FirebaseService,
    UtilsService,
    BackendService,
    authProviders
  ],
  imports: [
    NativeScriptModule,
    NativeScriptAnimationsModule,
    NativeScriptHttpModule,
    NativeScriptRouterModule,
    NativeScriptRouterModule.forRoot(appRoutes),
    LoginModule,
    HomeModule,
    StudentHomeModule,
    StudentHistoryModule,
    StudentAdminModule,
    TeacherHomeModule,
    TeacherStudentHomeModule,
    StickerGalleryModule,
    TeacherStudentArchiveModule
  ],
  declarations: [
      AppComponent,
  ],
  bootstrap: [AppComponent],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
