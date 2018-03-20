import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform, Events } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { Timers } from '../../providers/providers';

/**
 * Generated class for the AlertsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alerts',
  templateUrl: 'alerts.html',
})
export class AlertsPage {

  _timers: any = this.timers.timers;
  _tickTimers: any = new Array();
  currentTime: any = new Date();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private platform: Platform,
    public localNotifications: LocalNotifications,
    public timers: Timers,
    public events: Events) {
    events.subscribe('timers:loaded', allTimers => {
      this._timers = allTimers;
      this.initTimers();
    });
    events.subscribe('timers:added', newTimer => {
      this.tick(newTimer)
    });
  }

  initTimers() {
    for (let timer of this._timers) {
      this.tick(timer);
    }

    // add test timer
    // this.timers.addTimer(5000);
  }

  tick(timer) {
    setTimeout(() => {
      if (timer.timeRemaining < 1000) {
        return this._timers = this.timers.removeTimer(timer.id);
      }
      timer.timeRemaining = timer.timeRemaining - 1000;
      this.tick(timer);
    }, 1000);
  }

  newTimer() {
    this.navCtrl.push('AlertTimerPage', {
      action: 'add'
    });
  }

  editTimer(timerId: number) {
    this.navCtrl.push('AlertTimerPage', {
      action: 'edit',
      id: ''
    });
  }

  editTemperature() {
    this.navCtrl.push('AlertTemperaturePage');
  }

  deleteTimer(timerId: number) {
    let confirm = this.alertCtrl.create({
      title: 'Delete timer?',
      message: 'Are you sure you want to delete this timer?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this._timers = this.timers.removeTimer(timerId);
          }
        }
      ]
    });
    confirm.present();
  }

  deleteTemperature() {
    let confirm = this.alertCtrl.create({
      title: 'Delete temperature alert?',
      message: 'Are you sure you want to delete this temperature alert?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }

}
