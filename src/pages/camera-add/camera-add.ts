import { Component, NgZone } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, LoadingController } from 'ionic-angular';
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
              private ngZone: NgZone,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              private user: User) { 
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

  ionViewWillLeave() {
    this.disconnect();
    this.devices = [];
  }

  resetSteps() {
    // Reset back to connect step
    this.currentStep = 'scan';
    this.ngZone.run(function(){});
    // restart scan
    this.scan();
  }

  scan() {
    let loading = this.loadingCtrl.create({
      content: 'Searching for oven cam...'
    });
    loading.present();
    
    this.devices = [];  // clear list
    this.ble.startScan(this.ovenCamUUID).subscribe(
      device => {
        if(device.name === 'oven-cam') {
          this.ble.stopScan();
          clearInterval(timeout);
          loading.dismiss();
          this.onDeviceDiscovered(device)
        }
      }
    );

    let timeout = setTimeout(() => {
      loading.dismiss();
      this.ble.stopScan();
      this.setStatus('No oven cam found.')
    }, 5000);
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
    let loading = this.loadingCtrl.create({
      content: 'Connecting to oven-cam...'
    });
    loading.present();

    var device: any = this.devices[0];

    this.ble.connect(device.id).subscribe(
      device => {
        // Try reading characteristic to see if cam is setup already
        this.readBLE('ec01');
        // Todo - get returned promise from readBLE before closing loading message
        loading.dismiss();
      },
      error => {
        loading.dismiss();
        this.setStatus('Unable to connect to camera. Please try again.')
        this.resetSteps();
      }
    );
  }

  // Todo: connect and get wifi networks from camera
  // 'ec00' = wifi networks - WIP
  // 'ec01' = cam_id after wifi setup is complete 
  readBLE(characteristicId) {
    this.ble.read(this.devices[0].id, 'a018', characteristicId)
      .then(
        data => {
          data = this.bytesToString(data);
          if(data) { // todo - check if we get 0 or null value when not setup
            this.disconnect();
            let dataObj: object = {
              'id': data
            }
            this.user.createDoc('cameras', dataObj);
            this.currentStep = 'success';
            this.ngZone.run(function(){});
          } else {
            // Camera not setup - go to wifi setup
            this.currentStep = 'wifi';
            this.ngZone.run(function(){});
          }
        },
        e => {
          this.setStatus('readBLE error:');
        }
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
    let loading = this.loadingCtrl.create({
      content: 'Connecting oven cam to wifi...'
    });
    loading.present();

    this.ble.write(device, service, characteristic, value).then(
      result => {
        if(result === 'OK') {
          loading.dismiss();
          // Wifi connected successfully, now get cam id
          this.readBLE(characteristic);
        } else {
          // Todo: is this else ever used/needed?
          loading.dismiss();
          this.setStatus('Unable to connect camera to wifi. Please check network name and passwork and try again.');
        }
      },
      e => {
        loading.dismiss();
        this.setStatus('Unable to connect camera to wifi. Please check network name and passwork and try again.');
      }
    );
  }

  disconnect() {
    this.ble.disconnect(this.devices[0].id).then(() => {
      
    });
  }

  setStatus(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'top'
    });
    toast.present();
  }

  goHome() {
    this.navCtrl.pop();
  }
}
