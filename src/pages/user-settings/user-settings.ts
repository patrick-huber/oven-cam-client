import { Component, Input, ViewChild } from '@angular/core';
// import { EmailValidator } from '@angular/forms';
import { App, IonicPage, NavController, ToastController, AlertController } from 'ionic-angular';

import { User } from '../../providers/providers';

/**
 * Generated class for the UserSettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-settings',
  templateUrl: 'user-settings.html',
})
export class UserSettingsPage {
  currentUser: any;

  @Input() email: string = '';

  constructor(private app: App, public toastCtrl: ToastController, private alertCtrl: AlertController, public user: User, public navCtrl: NavController) {
    this.currentUser = user.currentUser;
    this.email = this.currentUser.email;
  }

  update() {
    let _this = this;
    this.currentUser.updateEmail(this.email).then(function() {
      _this.showMessage('Email address updated.')
      // Update successful.
    }).catch(function(error) {
      if(error.code === 'auth/requires-recent-login') {
        _this.reauthenticate();
      }
      console.log(error)
      // An error happened.
    });
  }

  reauthenticate() {
    let account = {
      email: this.currentUser.email,
      password: ''
    }

    let alert = this.alertCtrl.create({
      title: 'Please enter your password.',
      inputs: [
        {
          name: 'password',
          placeholder: 'Password',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Login',
          handler: data => {
            account.password = data.password;
            this.user.logInWithEmail(account).then(
              res => {
                // loading.dismiss();
                this.update();
              },
              error => {
                // loading.dismiss();
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
        }
      ]
    });
    alert.present();

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

  logout() {
    this.app.getRootNav().setRoot('WelcomePage');
    this.currentUser = this.user.logout(); // need to figure out "missing or insufficent permissions" error
  }
}
