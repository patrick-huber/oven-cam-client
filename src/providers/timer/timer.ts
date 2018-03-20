import { LocalNotifications } from '@ionic-native/local-notifications';
import { Platform, Events } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/*
  Timer alert with local notifications
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
  timerId = 1;

  constructor(public storage: Storage, public localNotifications: LocalNotifications, public platform: Platform, public events: Events) {}

  load() {
    return this.storage.get(this.TIMERS_KEY).then((storedTimers) => {
      if (storedTimers.length > 0) {
        console.log(storedTimers);
        this.timers = [];
        for (let timer of storedTimers) {
          this.updateTimeRemaining(timer);
          if(timer.timeRemaining > 0) {
            this.timers.push(timer);
            this.setNotification(timer);
            // Need to increase timerId higher than the latest timer id
            this.timerId = (timer.id >= this.timerId) ? (timer.id + 1) : this.timerId;
          }
          // Todo: add check for past timers? Do we need to notifiy of missed timer?
        }
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

    this.setNotification(newTimer);

    this.events.publish('timers:added', newTimer);
    
    this.timers.push(newTimer);
    return this.storage.set(this.TIMERS_KEY, this.timers);
  }

  removeTimer(timerId: number) {
    this.timers = this.timers.filter(function( obj ) {
      return obj.id !== timerId;
    });
    
    this.events.publish('timers:removed', timerId);

    // Todo: new to remove notification

    this.storage.set(this.TIMERS_KEY, this.timers);
    return this.timers;
  }

  modify(timerId: number, milliseconds: number){
    var foundIndex = this.timers.findIndex(x => x.id == timerId);
    var foundTimer: Timer = this.timers[foundIndex];
    foundTimer.timerLength = milliseconds;

    this.events.publish('timers:modified', foundTimer);

    this.storage.set(this.TIMERS_KEY, this.timers);
    return this.timers;
  }

  getTimer(timerId: number) {
    let timer: Timer;
    let foundtimer = this.timers.filter(function( obj ) {
      return obj.id === timerId;
    });
    return timer = foundtimer[0];
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

    if(this.platform.is('cordova')){
      // TODO: test if notifications carry over after reloading app and initilizing current timers from storage
      // this.localNotifications.cancelAll().then(() => {
        // Schedule the new notifications
        this.localNotifications.schedule(notification);
      // }); 
    }
  }

  updateTimeRemaining(timer: Timer) {
    var timeEllapsed = Math.abs(new Date().getTime() - timer.startTime.getTime());
    var timeRemaining = timer.timerLength - timeEllapsed;
    timer.timeRemaining = timeRemaining;
    return timer;
  }

  get allTimers() {
    return this.timers;
  }

}
