import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Keyboard } from 'ionic-angular';

/**
 * Modify/Create temperature alert
 */

@IonicPage()
@Component({
  selector: 'page-alert-temperature',
  templateUrl: 'alert-temperature.html',
})
export class AlertTemperaturePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public keyboard: Keyboard) {
  }

  temperature: number = 350;

  ionViewDidLoad() {
    // console.log('ionViewDidLoad AlertTemperaturePage');
  }

}
