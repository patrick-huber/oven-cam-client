import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { Timers } from '../../providers/providers';

/**
 * Display page of oven stream, temperature, and alerts
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-camera-view',
  templateUrl: 'camera-view.html',
})
export class CameraViewPage {

  _timers: any = this.timers.timers;

  constructor(
    public navCtrl: NavController,
    public timers: Timers) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CameraViewPage');
  }

  navTimersPage(){
    // Navigate to Alerts tab - can't use navPush since that re-inits the alerts page
    this.navCtrl.parent.select(1);
  }

}
