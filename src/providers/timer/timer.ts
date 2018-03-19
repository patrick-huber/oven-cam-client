import { LocalNotifications } from '@ionic-native/local-notifications';
import { Platform, Events } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/*
  Generated class for the TimerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()

export class Timer {
  id: number; // timer id
  startTime: Date; // Date object
  timerLength: number // length of timer in milliseconds
  timeRemaining: number // milliseconds remaining. Needed for tick
}

export class Timers {

  private TIMERS_KEY: string = '_timers';

  timers = [];
  timerId = 0;


  constructor(public storage: Storage, public localNotifications: LocalNotifications, public platform: Platform, public events: Events) {}

  load() {
    return this.storage.get(this.TIMERS_KEY).then((value) => {
      if (value.length > 0) {
        this.timers = [];
        for (let timer of value) {
          console.log(timer.timeRemaining)
          this.updateTimeRemaining(timer);
          console.log(timer.timeRemaining)
          if(timer.timeRemaining > 0) {
            this.timers.push(timer);
            console.log('setting notifications for stored timers');
            this.setNotification(timer);
          }
          // Todo: add check for past timers? Do we need to notifiy of missed timer?
        }
        console.log('loaded stored timers');
        console.log(this.timers);
      }

      this.events.publish('timers:loaded', this.timers);
      // return updated timers with expired timers removed
      return this.storage.set(this.TIMERS_KEY, this.timers);
    });
  }

  addTimer(millisecondsLength: number) {
    var newTimer: Timer = {
      id: this.timerId,
      startTime: new Date(),
      timerLength: millisecondsLength,
      timeRemaining: millisecondsLength
    };
    this.timerId++;

    console.log('setting notifications for new timer');
    this.setNotification(newTimer);

    // this.updateTimeRemaining(newTimer);

    console.log('timer added');

    this.events.publish('timers:added', newTimer);
    
    this.timers.push(newTimer);
    return this.storage.set(this.TIMERS_KEY, this.timers);

  }

  removeTimer(id: number) {
    console.log('remove timer');
    console.log(this.timers);
    this.timers = this.timers.filter(function( obj ) {
      return obj.id !== id;
    });
    console.log('made it here');
    console.log(this.timers);
    this.storage.set(this.TIMERS_KEY, this.timers);
    return this.timers;
  }

  modify(id: number, milliseconds: number){
    this.timers[id].timerLength = milliseconds;
    return this.storage.set(this.TIMERS_KEY, this.timers);
  }

  getTimer(id: number) {
    this.timers = this.timers.filter(function( obj ) {
      return obj.id === id;
    });
  }

  format(milliseconds: number) {
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

  setNotification(timer: Timer) {
     let notification = {
        id: timer.id,
        title: 'Oven Cam Timer',
        text: 'Timer for ' + this.format(timer.timerLength) + ' is done.',
        at: new Date(timer.startTime.getTime() + timer.timerLength)
    };

    // this.notifications.push(notification);


    if(this.platform.is('cordova')){

      // TODO: test if notifications carry over after reloading app and initilizing current timers from storage
      // this.localNotifications.cancelAll().then(() => {

        // Schedule the new notifications
        this.localNotifications.schedule(notification);
        // this.notifications = [];

        console.log('notification set');
      // }); 
    }
  }

  updateTimeRemaining(timer: Timer) {
    console.log('updateTimeRemaining')
    var timeEllapsed = Math.abs(new Date().getTime() - timer.startTime.getTime());
    var timeRemaining = timer.timerLength - timeEllapsed;
    timer.timeRemaining = timeRemaining;
    return timer;
    
  }

  get allTimers() {
    return this.timers;
  }

}
