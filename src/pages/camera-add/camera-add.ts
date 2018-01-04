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
  currentStep: string = 'scan';

  ovenCamUUID: string[] = ['a018']; // This will only search for the unique oven cam UUID
  serviceUUID: string = 'a018';

  wifi: { networks: string[], name: string, password: string } = {
    networks: [],
    name: '',
    password: ''
  };


  constructor(public navCtrl: NavController, 
              private ble: BLE,
              private ngZone: NgZone) { 
  }

  // ASCII only
  stringToBytes(string) {
   var array = new Uint8Array(string.length);
   for (var i = 0, l = string.length; i < l; i++) {
       array[i] = string.charCodeAt(i);
    }
    return array.buffer;
  }
  bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter');
    this.scan();
  }

  scan() {
    // this.setStatus('Scanning for Bluetooth LE Devices');
    
    this.devices = [];  // clear list

    this.ble.scan(this.ovenCamUUID, 5).subscribe(
      device => {
        if(device.name === 'oven-cam') {
          this.onDeviceDiscovered(device)
        } else {
          this.scanError('Found device, but wrong name');
        }
      },
      error => this.scanError(error)
    );

    // setTimeout(this.setStatus.bind(this), 5000, 'Scan complete');
  }

  // If location permission is denied, you'll end up here
  scanError(error) {
    this.setStatus('Error ' + error);
  }

  onDeviceDiscovered(device) {
    console.log('Discovered ' + JSON.stringify(device, null, 2));

    // Todo: need to add check if there are multiple oven-cams detected
    // Priority low (low probability of two cameras in setup mode at once)
    
    // this.setStatus('Camera found!');
    this.devices = [device];

    this.ngZone.run(function(){});
  }

  connect() {
    var device: any = this.devices[0];

    // this.setStatus('Connecting to oven-cam...');

    this.ble.connect(device.id).subscribe(
      device => {
        this.currentStep = 'wifi';
        this.ngZone.run(function(){});
      },
      error => this.setStatus(error)
    );
  }

  // Todo: connect and get wifi networks from camera
  // This is not currently used, but saving for future reference
  readBLE() {
    this.ble.read(this.devices[0].id, 'a018', 'ec00')
      .then(
        data => {
          data = this.bytesToString(data);
          this.setStatus(data);
          // this.wifi.networks = data.split(',');
          // this.currentStep = 'wifi';
          // this.ngZone.run(function(){});
        },
        e => this.setStatus('Error getting available networks.')
      );
  }

  submitWifi() {
    var deviceId: string = this.devices[0].id;
    var service: string = 'a018';
    var charWifi: string = 'ec01';

    let wifiCredentials: ArrayBuffer = this.stringToBytes(this.wifi.name + ',' + this.wifi.password);

    this.writeBLE(deviceId, service, charWifi, wifiCredentials);
  }

  writeBLE(device, service, characteristic, value): any {
    this.ble.write(device, service, characteristic, value).then(
      () => {
        this.disconnect();
        this.currentStep = 'success';
        this.ngZone.run(function(){});
      },
      e => this.setStatus('Error connecting to wifi')
    );
  }

  disconnect() {
    this.ble.disconnect(this.devices[0].id).then(
      e => this.setStatus('Error disconnecting')
    );;
  }

  setStatus(message) {
    alert(message);
    // this.ngZone.run(() => {
    //   this.statusMessage = message;
    // });
  }
}
