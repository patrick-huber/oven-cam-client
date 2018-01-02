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
  currentStep: string = 'wifi';

  ovenUUID: string[] = ['a018']; // This will only search for the unique oven cam UUID

  wifi: { name: string, password: string } = {
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

  ionViewDidEnter() {
    console.log('ionViewDidEnter');
    // this.scan();
  }

  scan() {
    this.setStatus('Scanning for Bluetooth LE Devices');
    
    this.devices = [];  // clear list
    

    // this.message = 'Searching';

    this.ble.scan(this.ovenUUID, 5).subscribe(
      device => this.onDeviceDiscovered(device), 
      error => this.scanError(error)
    );

    // setTimeout(this.setStatus.bind(this), 5000, 'Scan complete');
  }

  onDeviceDiscovered(device) {
    console.log('Discovered ' + JSON.stringify(device, null, 2));

    this.devices = [device];
    
    if(device.name === 'oven-cam') {
        this.setStatus('Camera found!');

        this.connect(device);

     
    }
  }

  connect(device) {
    this.setStatus('Connecting to oven-cam...');

    this.ble.connect(device.id).subscribe(
      device => this.setStatus('connected!'), 
      error => this.setStatus(error)
    );
  }

  testSend() {
    // this.setStatus('connected! trying to write');
    // Test to try and send data 
        let name: ArrayBuffer = this.stringToBytes(this.wifi.name);
        let pass: ArrayBuffer = this.stringToBytes(this.wifi.password);

        // this.setStatus(pass);

        this.ble.write(this.devices[0].id, 'a018', 'ec01', name).then(
          () => this.setStatus('Name sent'),
          e => this.setStatus('Error')
        );
        this.ble.write(this.devices[0].id, 'a018', 'ec00', pass).then(
          () => this.setStatus('Password sent'),
          e => this.setStatus('Error')
        );

        //this.ble.disconnect(this.devices[0].id);
  }

  read() {
    // Test to try and send data 
        // let name: ArrayBuffer = this.stringToBytes(this.wifi.name);
        // let pass: ArrayBuffer = this.stringToBytes(this.wifi.password);

        // this.setStatus(pass);

        this.ble.read(this.devices[0].id, 'a018', 'ec01').then(
          (name) => this.setStatus('Name read: ' + String.fromCharCode.apply(null, new Uint8Array(name))),
          e => this.setStatus('Error')
        );
        this.ble.read(this.devices[0].id, 'a018', 'ec00').then(
          (pass) => this.setStatus('Password read: ' + String.fromCharCode.apply(null, new Uint8Array(pass))),
          e => this.setStatus('Error')
        );

        //this.ble.disconnect(this.devices[0].id);
  }

  disconnect() {
    this.ble.disconnect(this.devices[0].id).then(
      () => this.setStatus('Disconnected'),
      e => this.setStatus('Error disconnecting')
    );;
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

  stepWifi() {
    this.currentStep = 'wifi';
  }

  sendWifiInfo(event) {
    this.scan();

    let pass: ArrayBuffer = this.stringToBytes(this.wifi.password);

    // this.setStatus(pass);

    // this.ble.write(this.devices[0].id, 'a018', 'ec00', pass).then(
    //   () => this.setStatus('Password sent'),
    //   e => this.setStatus('Error')
    // );
  }
}
