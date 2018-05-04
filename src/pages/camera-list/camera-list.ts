import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ActionSheetController } from 'ionic-angular';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { Observable } from 'rxjs/Observable';

import { User } from '../../providers/providers';

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
  _cameras: Array<Observable<any>> = [];
  _user: any = null;
  _camerasCollection: AngularFirestoreCollection<any>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public actionSheetCtrl: ActionSheetController,
    private afs: AngularFirestore,
    public user: User) {
      this._user = user.currentUser;
      this._camerasCollection = this.afs.collection('cameras');
      this.afs.collection('users').doc(this._user.uid).collection<any>('cameras').valueChanges()
        .subscribe((cameras: any) => {
          this._cameras = [];
          for (var i = cameras.length - 1; i >= 0; i--) {
            this.getCamera(cameras[i].id);
          }
      });
  }

  getCamera(cameraId) {
    this._camerasCollection.doc(cameraId).valueChanges().subscribe((camera: any) => {
      this._cameras.push(camera);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CameraListPage');
  }

  addCamera() {
    this.navCtrl.push('CameraAddPage');
  }

  cardClick() {
    this.navCtrl.push('CameraViewPage');
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
