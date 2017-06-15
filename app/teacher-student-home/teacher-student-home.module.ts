import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import {TNSFontIconModule, TNSFontIconService, TNSFontIconPipe, TNSFontIconPurePipe} from 'nativescript-ngx-fonticon';

import { teacherStudentHomeRouting } from "./teacher-student-home.routes";
import { TeacherStudentHomeComponent } from "./teacher-student-home.component";

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    teacherStudentHomeRouting,
    TNSFontIconModule.forRoot({
      'fa': 'fonts/font-awesome.css'
    })
  ],
  declarations: [
    TeacherStudentHomeComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class TeacherStudentHomeModule { }
