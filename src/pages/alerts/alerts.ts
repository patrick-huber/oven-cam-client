import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
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

  _timers: any;
  _tickTimers: any = new Array();
  currentTime: any = new Date();

  notifications: any[] = [];
  notificationDate: Date = new Date();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private platform: Platform,
    public localNotifications: LocalNotifications,
    public timers: Timers) {
  }

  ionViewWillLoad() {
    this._timers = this.timers.allTimers;
    for (let timer of this._timers) {
      this.tick(timer);
    }
    this.test1();
  }

  test1() {
    console.log('test1');

    let currentSecs = this.notificationDate.getSeconds();

    this.notificationDate.setSeconds(currentSecs + 5);

    let notification = {
        id: 'test1',
        title: 'Hey!',
        text: 'You just got notified :)',
        at: this.notificationDate
    };

    this.notifications.push(notification);


    if(this.platform.is('cordova')){
        // Cancel any existing notifications
        this.localNotifications.cancelAll().then(() => {
 
            // Schedule the new notifications
            this.localNotifications.schedule(this.notifications);
 
            this.notifications = [];
 
            console.log('notifications set');
 
        });
 
    }
  }

  tick(timer) {
    setTimeout(() => {
      if (timer.timeRemaining < 1000) { return; }
      timer.timeRemaining = timer.timeRemaining - 1000;
      this.tick(timer);
    }, 1000);
  }

  newTimer() {
    this.navCtrl.push('AlertTimerPage', {
      action: 'add'
    });
  }

  editTimer() {
    this.navCtrl.push('AlertTimerPage', {
      action: 'edit',
      id: ''
    });
  }

  editTemperature() {
    this.navCtrl.push('AlertTemperaturePage');
  }

  deleteTimer() {
    let confirm = this.alertCtrl.create({
      title: 'Delete timer?',
      message: 'Are you sure you want to delete this timer?',
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
