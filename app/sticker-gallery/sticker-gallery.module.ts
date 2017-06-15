import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import {TNSFontIconModule, TNSFontIconService, TNSFontIconPipe, TNSFontIconPurePipe} from 'nativescript-ngx-fonticon';

import { stickerGalleryRouting } from "./sticker-gallery.routes";
import { StickerGalleryComponent } from "./sticker-gallery.component";

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    stickerGalleryRouting,
    TNSFontIconModule.forRoot({
      'fa': 'fonts/font-awesome.css'
    })
  ],
  declarations: [
    StickerGalleryComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class StickerGalleryModule { }
