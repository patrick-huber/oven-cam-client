import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
  httpSrc: string = '';
  ogSrc: string = '';
  imgSrc: string = '';
  streamInterval: any;

  cam_name: string = '';

  _timers: any = this.timers.timers;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public timers: Timers) {
    this.cam_name = navParams.get('name');
    this.httpSrc = 'http://' + navParams.get('ip_address');
    this.ogSrc = this.httpSrc + '/images/still.jpg';
    this.imgSrc = this.httpSrc + '/images/loading.jpg';
    this.startStream();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CameraViewPage');
  }

  startStream() {
    this.streamInterval = setInterval(() => { 
      let d = new Date();
      this.imgSrc = this.ogSrc + '?' + String(d.getTime());
    }, 1000);
  }

  stopStream() {
    clearTimeout(this.streamInterval);
  }

  navTimersPage(){
    // Navigate to Alerts tab - can't use navPush since that re-inits the alerts page
    this.navCtrl.parent.select(1);
  }

}
