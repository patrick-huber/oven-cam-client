import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ActionSheetController } from 'ionic-angular';

/**
 * Generated class for the CameraListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-camera-list',
  templateUrl: 'camera-list.html',
})
export class CameraListPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public actionSheetCtrl: ActionSheetController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CameraListPage');
  }

  addCamera() {
    this.navCtrl.push('CameraAddPage');
  }

  cardClick() {
    alert('cardClick');
  }

  settingsClick(e: Event) {
    e.stopPropagation();
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Edit cam settings',
      buttons: [
        {
          text: 'Rename',
          icon: !this.platform.is('ios') ? 'create' : null,
          handler: () => {
            console.log('Rename clicked');
          }
        },
        // {
        //   text: 'Share',
        //   icon: !this.platform.is('ios') ? 'share' : null,
        //   handler: () => {
        //     console.log('Share clicked');
        //   }
        // },
        // {
        //   text: 'Favorite',
        //   icon: !this.platform.is('ios') ? 'heart-outline' : null,
        //   handler: () => {
        //     console.log('Favorite clicked');
        //   }
        // },
        {
          text: 'Delete',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            console.log('Delete clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

}
