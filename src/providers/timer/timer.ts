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
  length: number // length of timer in seconds
}

export class Timers {

  private TIMERS_KEY: string = '_timers';

  timers: Timer[];

  _defaults: any;


  constructor(public storage: Storage, defaults: any) {
    this._defaults = defaults; // loading in some temp timers from app.module for testing
  }

  load() {
    console.log('load')
    return this.storage.get(this.TIMERS_KEY).then((value) => {
      if (value) {
        return this.timers = value;
      } else {
        // load test timers
        return this.timers = this._defaults;
      }
    });
  }

  add(timerLength: number) {
    var newTimer: Timer = {
      startTime: new Date(),
      length: timerLength
    };

    this.timers.push(newTimer);
    return this.storage.set(this.TIMERS_KEY, this.timers);

  }

  remove(index: number) {
    this.timers.slice(index, 1);
    return this.storage.set(this.TIMERS_KEY, this.timers);
  }

  modify(index: number, timerLength: number){
    this.timers[index].length = timerLength;
    return this.storage.set(this.TIMERS_KEY, this.timers);
  }

  getTimer(index: number) {
    this.storage.get(this.TIMERS_KEY)
      .then(timers => {
        return timers[index];
      });
  }

  get allTimers() {
    return this.timers;
  }

}
