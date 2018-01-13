import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CameraStreamPage } from './camera-stream';

@NgModule({
  declarations: [
    CameraStreamPage,
  ],
  imports: [
    IonicPageModule.forChild(CameraStreamPage),
  ],
  exports: [
    CameraStreamPage
  ]
})
export class CameraStreamPageModule {}
