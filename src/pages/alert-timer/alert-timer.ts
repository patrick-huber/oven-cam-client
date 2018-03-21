import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { Timers } from '../../providers/providers';
import { Timer } from '../../providers/timer/timer';

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

  id: number; // Timer id - used to edit timer. Will be -1 if no timer being edited
  currentTimer: Timer;

  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    public alertCtrl: AlertController,
    public timers: Timers
  ) {
    if(navParams.get('id')) {
      this.id = navParams.get('id');
      this.currentTimer = timers.getTimer(this.id)
      this.timeInput = timers.format(this.currentTimer.timeRemaining)
    } else {
      this.id = -1;
    }
  }

  ionViewDidLoad() {
    // console.log(this.currentTimer);
    // if(this.currentTimer) {
    //   console.log('current timer not null');
    // }
  }

  save() {
    let actionEdit: boolean = false;
    var timerArray = this.timeInput.split(':');
    var timerHours = parseInt(timerArray[0]);
    var timerMinutes = parseInt(timerArray[1]);
    var timerSeconds = parseInt(timerArray[2]);
    
    var newTimerLength = timerSeconds*1000 + timerMinutes*60*1000 + timerHours*60*60*1000 // convert to milliseconds, then add together
    if(this.id !== -1) {
      // remove old timer if editing
      this.timers.modify(this.id, newTimerLength);
      actionEdit = true;
    } else {
      this.timers.addTimer(newTimerLength);
    }

    // Todo: add error messaging

    this.showMessage(newTimerLength, actionEdit)
  }

  showMessage(timerLength: number, editTimer: boolean) {
    let alertObj = (editTimer) ? {
      title: 'Timer updated',
      message: 'Your timer was updated to ' + this.timers.format(timerLength) + '.',
      buttons: [
        {
          text: 'Back to alerts',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    }
    : 
    {
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
    };
    let confirm = this.alertCtrl.create(alertObj);
    confirm.present();

  }

}
