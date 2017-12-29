import { Component, NgZone } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';

import { User } from '../../providers/providers';
import { MainPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-camera-add',
  templateUrl: 'camera-add.html'
})
export class CameraAddPage {
  devices: any[] = [];
  statusMessage: string;
  message: string;

  constructor(public navCtrl: NavController, 
              private ble: BLE,
              private ngZone: NgZone) { 
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter');
    this.scan();
  }

  scan() {
    this.setStatus('Scanning for Bluetooth LE Devices');
    this.devices = [];  // clear list
    var ovenUUID = [];
    ovenUUID.push('a018');

    this.message = 'Searching';

    this.ble.scan(ovenUUID, 5).subscribe(
      device => this.onDeviceDiscovered(device), 
      error => this.scanError(error)
    );

    setTimeout(this.setStatus.bind(this), 5000, 'Scan complete');
  }

  onDeviceDiscovered(device) {
    console.log('Discovered ' + JSON.stringify(device, null, 2));
    if(device.name === 'oven-cam') {
      this.ngZone.run(() => {
        this.message = 'Camera found!'
      });
    }
  }

  // If location permission is denied, you'll end up here
  scanError(error) {
    this.setStatus('Error ' + error);
    // let toast = this.toastCtrl.create({
    //   message: 'Error scanning for Bluetooth low energy devices',
    //   position: 'middle',
    //   duration: 5000
    // });
    // toast.present();
  }

  setStatus(message) {
    alert(message);
    // this.ngZone.run(() => {
    //   this.statusMessage = message;
    // });
  }

  deviceSelected(device) {
    console.log(JSON.stringify(device) + ' selected');
    // this.navCtrl.push(DetailPage, {
    //   device: device
    // });
  }
}
