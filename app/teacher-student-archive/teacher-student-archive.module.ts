import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import {TNSFontIconModule, TNSFontIconService, TNSFontIconPipe, TNSFontIconPurePipe} from 'nativescript-ngx-fonticon';

import { teacherStudentArchiveRouting } from "./teacher-student-archive.routes";
import { TeacherStudentArchiveComponent } from "./teacher-student-archive.component";

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    teacherStudentArchiveRouting,
    TNSFontIconModule.forRoot({
      'fa': 'fonts/font-awesome.css'
    })
  ],
  declarations: [
    TeacherStudentArchiveComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class TeacherStudentArchiveModule { }
