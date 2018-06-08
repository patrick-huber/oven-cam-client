import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, ActionSheetController, AlertController } from 'ionic-angular';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { Observable } from 'rxjs/Observable';

import { User } from '../../providers/providers';

/**
 * Generated class for the CameraListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

interface CameraOptions {
  battery_level: number,
  charging: boolean,
  local_ip: string,
  name: string,
  id: string,
  status: string
}

@IonicPage()
@Component({
  selector: 'page-camera-list',
  templateUrl: 'camera-list.html',
})
export class CameraListPage {
  // cameraOptions: Observable<CameraOptions>;

  _cameras: Array<CameraOptions> = [];
  _user: any = null;
  _camerasCollection: AngularFirestoreCollection<any>;
  _userCamerasCollection: AngularFirestoreCollection<any>;
  _cameras_loaded: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public platform: Platform,
    public actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private afs: AngularFirestore,
    public user: User) {
      this._user = user.currentUser;
      this._camerasCollection = this.afs.collection('cameras');
      this._userCamerasCollection = this.afs.collection('users').doc(this._user.uid).collection<any>('cameras')  ;

      this._userCamerasCollection.valueChanges()
        .subscribe((cameras: any) => {
          if(cameras.length > 0) {
            this._cameras = [];
            for (var i = cameras.length - 1; i >= 0; i--) {
              this.getCamera(cameras[i].id);
            }
          } else {
            this._cameras = [];
            this._cameras_loaded = true;
          }
        });
        // Todo: add error messaging for firestore observable
  }

  getCamera(cameraId) {
    this._camerasCollection.doc(cameraId).valueChanges().subscribe((camera: any) => {
      camera.id = cameraId;
      // Check if cam aleady in array
      let camera_index: number = -1;
      camera_index = this._cameras.findIndex(camera => camera.id === cameraId);
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

  deleteCamera(cameraId) {
    this._userCamerasCollection.doc(cameraId).delete();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CameraListPage');
  }

  addCamera() {
    let profileModal = this.modalCtrl.create('CameraAddPage');
    profileModal.present();
    // this.navCtrl.push('CameraAddPage');
  }

  viewCam(cameraId) {
    let foundCamera: any[] = this._cameras.filter(function( obj ) {
      return obj.id === cameraId;
    });
    let ip = foundCamera[0].local_ip;
    let cam_name = foundCamera[0].name;
    this.navCtrl.push('CameraViewPage', {
      ip_address: ip,
      name: cam_name
    });
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
            let alert = this.alertCtrl.create({
                title: 'Delete cam',
                subTitle: 'Are you sure you want to delete this cam? This will not reset the camera or remove from other users.',
                buttons: [
                  {
                    text: 'Cancel',
                    role: 'cancel'
                  },
                  {
                    text: 'Delete',
                    handler: data => {
                      this.deleteCamera(cameraId);
                    }
                  }
                ]
            });
            alert.present();
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
