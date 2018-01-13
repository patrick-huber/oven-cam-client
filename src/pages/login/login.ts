import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

import { User } from '../../providers/providers';
import { MainPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { email: string, password: string } = {
    email: 'test@test.com',
    password: 'pass123'
  };

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }

  // Attempt to login in through our User service
  logInWithEmail() {
    this.user.logInWithEmail(this.account).then(
      res => {
        this.successLogIn();
      },
      error => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
          this.showMessage('Wrong password.');
        } else {
          this.showMessage(errorMessage);
        }
      }
    );
  }

  logInWithFacebook() {
    this.user.logInWithFacebook().then(
      res => {
        this.successLogIn();
      },
      error => {
        this.showMessage('Error signing in with Facebook: ' + error)
      }
    );
  }

  successLogIn() {
    this.navCtrl.push(MainPage);
  }

  showMessage(message) {
    // Unable to log in
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'top'
    });
    toast.present();
  }
}
