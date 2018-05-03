import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

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
  _tickTimers: any = new Array();
  currentTime: any = new Date();
  tickTimeout: any = new Array();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public timers: Timers,
    public events: Events) {
    events.subscribe('timers:loaded', allTimers => {
      // console.log(this._timers);
      this._timers = allTimers;
      // this.initTimers();
    });
    events.subscribe('timers:added', newTimer => {
      this._timers = timers.allTimers;
      // this.tick(newTimer)
    });
    events.subscribe('timers:removed', removedTimerId => {
      this._timers = timers.allTimers;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CameraViewPage');
  }

  initTimers() {
    for (let timer of this._timers) {
      this.tick(timer);
    }

    // add test timer
    // this.timers.addTimer(5000);
  }

  tick(timer) {
    this.tickTimeout[timer.id] = setTimeout(() => {
      if (timer.timeRemaining < 1000) {
        return this._timers = this.timers.removeTimer(timer.id);
      }
      timer.timeRemaining = timer.timeRemaining - 1000;
      this.tick(timer);
    }, 1000);
  }

  navTimersPage(){
    this.navCtrl.push('AlertsPage');
  }

}
