import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, LoadingController } from 'ionic-angular';

import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

import { User } from '../../providers/providers';
import { MainPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { email: string, password: string } = {
    email: '',
    password: ''
  };

  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public translateService: TranslateService,
    private afs: AngularFirestore) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })
  }

  signUpWithEmail() {
    let loading = this.loadingCtrl.create({
      content: 'Creating account...'
    });
    loading.present();
    this.user.signUpWithEmail(this.account).then(
      res => {
        loading.dismiss();
        this.successSignUp(res);
      },
      error => {
        loading.dismiss();
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

  signUpWithFacebook() {
    let loading = this.loadingCtrl.create({
      content: 'Creating account...'
    });
    loading.present();
    this.user.signUpWithFacebook().then(
      res => {
        loading.dismiss();
        this.successSignUp(res.user);
      },
      error => {
        loading.dismiss();
        this.showMessage('Error connecting with Facebook: ' + error)
      }
    );
  }


  successSignUp(user) {
    console.log(user);
    // operationType === "signIn"
    // usersCollection: AngularFirestoreCollection<Users>; //Firestore collection
    // this.user._loggedIn(user);
    this.navCtrl.push('WelcomePage');
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
