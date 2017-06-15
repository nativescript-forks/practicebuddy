import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import {TNSFontIconModule, TNSFontIconService, TNSFontIconPipe, TNSFontIconPurePipe} from 'nativescript-ngx-fonticon';

import { teacherHomeRouting } from "./teacher-home.routes";
import { TeacherHomeComponent } from "./teacher-home.component";

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    teacherHomeRouting,
    TNSFontIconModule.forRoot({
      'fa': 'fonts/font-awesome.css'
    })
  ],
  declarations: [
    TeacherHomeComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class TeacherHomeModule { }
