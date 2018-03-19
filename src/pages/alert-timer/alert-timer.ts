import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { Timers } from '../../providers/providers';

/**
 * Generated class for the AlertTimerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alert-timer',
  templateUrl: 'alert-timer.html',
})
export class AlertTimerPage {

  @Input() timeInput: string = '00:00:00';

  currentTimer: object;

  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    public alertCtrl: AlertController,
    public timers: Timers
  ) {
    let action = navParams.get('action');
    if(navParams.get('id')) {
      let id = navParams.get('id');
      let currentTimer = timers.getTimer(id);
    } else {
      let id = false;
      let currentTimer = {};
    }
  }

  ionViewDidLoad() {
    if(this.currentTimer) {
      console.log('current timer not null');
    }
  }

  save() {
    var timerArray = this.timeInput.split(':');
    var timerHours = parseInt(timerArray[0]);
    var timerMinutes = parseInt(timerArray[1]);
    var timerSeconds = parseInt(timerArray[2]);
    
    var newTimerLength = timerSeconds*1000 + timerMinutes*60*1000 + timerHours*60*60*1000 // convert to milliseconds, then add together
    this.timers.addTimer(newTimerLength);

    // Todo: add error messaging

    this.showMessage(newTimerLength)
  }

  showMessage(timerLength: number) {
    let confirm = this.alertCtrl.create({
      title: 'Timer added',
      message: 'Your new timer for ' + this.timers.format(timerLength) + ' has been set.',
      buttons: [
        {
          text: 'Add another timer',
          handler: () => {
            this.timeInput = '00:00:00';
          }
        },
        {
          text: 'Back to alerts',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    });
    confirm.present();

  }

}
