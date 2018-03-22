import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Platform } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';

/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }Ø
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable()
export class User {
  _user: any = null;

  constructor(
    private afAuth: AngularFireAuth,
    private fb: Facebook,
    private platform: Platform) { }

  /**
   * Create new user from email and password
   * Returns promise with user object or error message
   */
  signUpWithEmail(account: any) {

    let seq = this.afAuth.auth.createUserWithEmailAndPassword(account.email, account.password);

    seq.then(
      res => this._loggedIn(res),
      error => { return error }
    );

    return seq;
  }

  /**
   * Create new user from Facebook account
   * Returns promise with user object or error message
   */
  signUpWithFacebook() {
    let seq: any;
    if (this.platform.is('cordova')) {
      this.fb.login(['email', 'public_profile']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        seq =  firebase.auth().signInWithCredential(facebookCredential);
      })
    }
    else {
      seq = this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
    }

    seq.then(
      res => this._loggedIn(res.user),
      error => { return error }
    );

    return seq;
  }

  /**
   * Login user from email and password
   * Returns promise with user object or error message
   */
  logInWithEmail(account: any) {
    let seq = this.afAuth.auth.signInWithEmailAndPassword(account.email, account.password)

    seq.then(
      res => this._loggedIn(res),
      error => { return error }
    );

    return seq;
  }

  /**
   * Login user from Facebook account
   * Returns promise with user object or error message
   * Todo: right now it creates new user if none exists. Need to check if the are user, then redirect to signup page
   */
  logInWithFacebook() {
    let seq: any;
    if (this.platform.is('cordova')) {
      return this.fb.login(['email', 'public_profile']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        seq = firebase.auth().signInWithCredential(facebookCredential);
      })
    }
    else {
      seq = this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
    }

    seq.then(
      res => this._loggedIn(res.user),
      error => { return error }
    );

    return seq;
  }

  /**
   * Check if user is authenticated.
   * Sets _user with user info or null if not authenticated.
   */
  checkLoggedIn() {
    let seq = this.afAuth.authState;

    seq.subscribe((user: firebase.User) => {
      if (!user) {
        return this._user = null;
      }
      this._loggedIn(user);
    });

    return seq;
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this.afAuth.auth.signOut();
    this._user = null;
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(res) {
    this._user = res.user;
  }
}
