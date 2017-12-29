import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { CameraAddPage } from './camera-add';

@NgModule({
  declarations: [
    CameraAddPage,
  ],
  imports: [
    IonicPageModule.forChild(CameraAddPage),
    TranslateModule.forChild()
  ],
  exports: [
    CameraAddPage
  ]
})
export class CameraAddPageModule { }
