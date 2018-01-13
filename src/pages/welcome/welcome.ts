import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { User } from '../../providers/providers';

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
  _user: any;

  constructor(
    public navCtrl: NavController,
    public user: User) {
      // Check to see if user is logged in at launch
      this.user.checkLoggedIn()
        .subscribe(
          res => {
            this._user = this.user._user;
          }
        );
  }

  ionViewWillEnter() {
  }

  logout() {
    this._user = this.user.logout();
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
