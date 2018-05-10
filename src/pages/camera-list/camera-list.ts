import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ActionSheetController, AlertController } from 'ionic-angular';

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
    private alertCtrl: AlertController,
    private afs: AngularFirestore,
    public user: User) {
      this._user = user.currentUser;
      this._camerasCollection = this.afs.collection('cameras');
      this.afs.collection('users').doc(this._user.uid).collection<any>('cameras').valueChanges()
        .subscribe((cameras: any) => {
          console.log('subscribe fire');
          this._cameras = [];
          for (var i = cameras.length - 1; i >= 0; i--) {
            this.getCamera(cameras[i].id);
          }
          console.log(this._cameras)
      });
  }

  getCamera(cameraId) {
    this._camerasCollection.doc(cameraId).valueChanges().subscribe((camera: any) => {
      camera.id = cameraId;
      // Check if cam aleady in array
      let camera_index: number = -1;
      this._cameras.find(function(cameraId, index) {
        camera_index = index;
      });
      if(camera_index === -1){
        // no camera in cameras array, push new camera object
        this._cameras.push(camera);
      } else {
        // camera already in arry, update current object
        this._cameras[camera_index] = camera;
      }
    });
  }

  renameCamera(cameraId, new_name) {
    this._camerasCollection.doc(cameraId).set({
      name: new_name
    }, {merge: true});
    // todo: add success and error messaging
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CameraListPage');
  }

  addCamera() {
    this.navCtrl.push('CameraAddPage');
  }

  viewCam(camId) {
    console.log(camId);
    this.navCtrl.push('CameraViewPage');
  }

  settingsClick(e: Event, cameraId: string) {
    e.stopPropagation();
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Edit cam settings',
      buttons: [
        {
          text: 'Rename',
          icon: !this.platform.is('ios') ? 'create' : null,
          handler: () => {
            let alert = this.alertCtrl.create({
                title: 'Rename cam',
                inputs: [
                  {
                    name: 'name',
                    placeholder: 'New Name'
                  }
                ],
                buttons: [
                  {
                    text: 'Cancel',
                    role: 'cancel'
                  },
                  {
                    text: 'Save',
                    handler: data => {
                      this.renameCamera(cameraId, data.name);
                    }
                  }
                ]
              });
              alert.present();
          }
        },
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
