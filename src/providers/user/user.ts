import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable } from 'rxjs/Observable';

import { Platform, Events } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';

/**
 * Handles user authentication via Angular Fire Authentication
 */
@Injectable()
export class User {
  _user: any = null;

  private settingsDoc: AngularFirestoreDocument<object>;
  userSettings: Observable<object>;

  usersCollection: any;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private fb: Facebook,
    private platform: Platform,
    events: Events) {
      this.usersCollection = afs.collection('users');
      afAuth.authState.subscribe((user: firebase.User) => {
        if (!user) {
          console.log('no user logged in')
          return this._user = null;
        }
        console.log('user logged in');
        this._user = user;
        events.publish('user:loaded', user);
      });
  }

  /**
   * Create new user from email and password
   * Returns promise with user object or error message
   */
  signUpWithEmail(account: any) {

    let seq = this.afAuth.auth.createUserWithEmailAndPassword(account.email, account.password);

    seq.then(
      res => this.signUpSuccess(res),
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
      res => this.signUpSuccess(res.user),
      error => { return error }
    );

    return seq;
  }

  signUpSuccess(user) {
    // Add new user details to users collection in db
    let newUserDoc = this.usersCollection.doc(user.uid);
    newUserDoc.set({
      email: user.email
    })
    .then(function() {
      console.log("New user doc successfully created!");
    });

    // Set logged in user
    this._user = user;
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
  // checkLoggedIn() {
  //   let seq = this.afAuth.authState;

  //   seq.subscribe((user: firebase.User) => {
  //     // console.log(user);
  //     if (!user) {
  //       return this._user = null;
  //     }

  //     return this._loggedIn(user);

  //   });

  //   return seq;
  // }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this.afAuth.auth.signOut();
    return this._user = null;
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(res) {
    return this._user = res;
  }

  createDoc(docLocation: string, docObj: object) {
    var userDocLocation: string = 'users/' + this._user.uid + '/' + docLocation;
    this.afs.collection(userDocLocation)
    .add(docObj).then(documentReference => {
      console.log(`Added document with name: ${documentReference.id}`);
    });
  }

  get currentUser() {
    return this.afAuth.auth.currentUser;
  }

  get settings() {
    return this.userSettings;
  }
}
