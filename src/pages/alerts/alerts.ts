import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

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
  currentTime: object = new Date();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public timers: Timers,) {
  }

  ionViewWillLoad() {
    this.timers.load().then(() => {
      this._timers = this.timers.allTimers;
    });
  }

  formatTimer(milliseconds) {
    var inputSeconds = milliseconds / 1000;
    const secNum = parseInt(inputSeconds.toString(), 10); // don't forget the second param
    const hours = Math.floor(secNum / 3600);
    const minutes = Math.floor((secNum - (hours * 3600)) / 60);
    const seconds = secNum - (hours * 3600) - (minutes * 60);
    let hoursString = '';
    let minutesString = '';
    let secondsString = '';
    hoursString = (hours < 10) ? '0' + hours : hours.toString();
    minutesString = (minutes < 10) ? '0' + minutes : minutes.toString();
    secondsString = (seconds < 10) ? '0' + seconds : seconds.toString();
    return hoursString + ':' + minutesString + ':' + secondsString;
  }

  editTimer() {
    this.navCtrl.push('AlertTimerPage');
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
