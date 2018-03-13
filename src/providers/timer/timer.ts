// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/*
  Generated class for the TimerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()

export class Timer {
  startTime: object; // Date object
  timerLength: number // length of timer in milliseconds
  timeRemaining: number // milliseconds remaining. Needed for tick
}

export class Timers {

  private TIMERS_KEY: string = '_timers';

  timers = [];

  _defaults: any;


  constructor(public storage: Storage, defaults: any) {
    // add test timers
    if(defaults.length) {
      for (let testTimer of defaults) {
        this.addTimer(testTimer);
      }
    }
    // this._defaults = defaults; // loading in some temp timers from app.module for testing
  }

  load() {
    return this.storage.get(this.TIMERS_KEY).then((value) => {
      if (value) {
        for (let timer of value) {
          this.updateTimeRemaining(timer);
        }
        this.timers = value;
      }
      return this.timers;
    });
  }

  addTimer(millisecondsLength: number) {
    var newTimer: Timer = {
      startTime: new Date(),
      timerLength: millisecondsLength,
      timeRemaining: millisecondsLength
    };
    // this.tick(newTimer);
    
    this.timers.push(newTimer);

    // this.tick(this.timers[this.timers.length - 1]);
    
    return this.storage.set(this.TIMERS_KEY, this.timers);

  }

  remove(index: number) {
    this.timers.slice(index, 1);
    return this.storage.set(this.TIMERS_KEY, this.timers);
  }

  modify(index: number, milliseconds: number){
    this.timers[index].timerLength = milliseconds;
    return this.storage.set(this.TIMERS_KEY, this.timers);
  }

  getTimer(index: number) {
    this.storage.get(this.TIMERS_KEY)
      .then(timers => {
        return timers[index];
      });
  }

  format(milliseconds) {
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

  updateTimeRemaining(timer) {
    var timeEllapsed = Math.abs(new Date().getTime() - timer.startTime.getTime());
    return timer.timeRemaining = timer.timerLength - timeEllapsed;
  }

  get allTimers() {
    return this.timers;
  }

}
