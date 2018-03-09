import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AlertTemperaturePage } from './alert-temperature';

@NgModule({
  declarations: [
    AlertTemperaturePage,
  ],
  imports: [
    IonicPageModule.forChild(AlertTemperaturePage),
  ],
})
export class AlertTemperaturePageModule {}
