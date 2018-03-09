import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AlertTimerPage } from './alert-timer';

@NgModule({
  declarations: [
    AlertTimerPage,
  ],
  imports: [
    IonicPageModule.forChild(AlertTimerPage),
  ],
})
export class AlertTimerPageModule {}
