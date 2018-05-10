import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CameraViewPage } from './camera-view';

@NgModule({
  declarations: [
    CameraViewPage,
  ],
  imports: [
    IonicPageModule.forChild(CameraViewPage)
  ],
})
export class CameraViewPageModule {}
