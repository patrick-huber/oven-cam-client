import { Component } from '@angular/core';
import { EmailValidator } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

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
  private settingsDoc: AngularFirestoreDocument<object>;
  settings: Observable<object>;
  userSettings: object = {}

  updated: boolean = false;
  updatedSettings: object = {};

  dataLoaded: boolean = false;

  constructor(private afs: AngularFirestore, user: User) {
    this.settingsDoc = this.afs.doc<object>('users/'+user.currentUser.uid);
    this.settings = this.settingsDoc.valueChanges()
    var _this = this;
    this.settingsDoc.valueChanges().subscribe(function(value) {
      _this.userSettings = value;
      _this.dataLoaded = true;
    });

  }

  updateField(field: string, value: string) {
    console.log('field: ' + field, ' value: ' + value)
    this.updated = true;
    this.updatedSettings[field] = value;
  }

  update() {
    console.log(this.updatedSettings)
    if(this.updated) {
      this.settingsDoc.update(this.updatedSettings); 
    }
  }

  ionViewDidLoad() {
  }


  ionViewWillEnter() {
    
  }
}
