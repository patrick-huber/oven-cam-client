import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

/**
 * Connect to and view oven cam express server hosting images
 */

@IonicPage()
@Component({
  selector: 'page-camera-stream',
  templateUrl: 'camera-stream.html',
})
export class CameraStreamPage {
  ogSrc: String = 'http://10.0.0.31:3000/images/still.jpg';
  imgSrc: String = this.ogSrc;
  streamInterval: any;

  constructor() {
    this.startStream();
  }

  startStream() {
    this.streamInterval = setInterval(() => { 
      let d = new Date();
      this.imgSrc = this.ogSrc + '?' + String(d.getTime());
    }, 1000);
  }

  stopStream() {
    clearTimeout(this.streamInterval);
  }

}
