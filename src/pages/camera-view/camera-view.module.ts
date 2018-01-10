import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CameraViewPage } from './camera-view';
import { CameraStreamPageModule } from '../camera-stream/camera-stream.module';

@NgModule({
  declarations: [
    CameraViewPage,
  ],
  imports: [
    IonicPageModule.forChild(CameraViewPage),
    CameraStreamPageModule
  ],
})
export class CameraViewPageModule {}
