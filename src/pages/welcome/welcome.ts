import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Platform } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';

/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
*/
@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {

  constructor(public navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private fb: Facebook,
    private platform: Platform) {}

  user;

  ionViewWillEnter() {
    this.afAuth.authState.subscribe((user: firebase.User) => {
      if (!user) {
        this.user = null;
        return;
      }
      this.user = user;
    });
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  cameraAdd() {
    this.navCtrl.push('CameraAddPage');
  }

  login() {
    this.navCtrl.push('LoginPage');
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }
}
