import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { OneSignal } from "@ionic-native/onesignal";
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { Geofence } from '@ionic-native/geofence';
import { PushalarmPage } from '../pages/pushalarm/pushalarm';
import { ClientlocationPage } from "../pages/clientlocation/clientlocation";
import { AutocompletelocationPage } from "../pages/autocompletelocation/autocompletelocation";
import { Storage } from "@ionic/storage";
import { IonicPage, Nav, NavParams } from "ionic-angular";
import { Inject, ViewChild } from "@angular/core";
import { User } from "../models/user";
import { AngularFireDatabase } from "angularfire2/database";
import { FirebaseProvider } from "../providers/firebase/firebase";
import {
  AlertController
} from "ionic-angular";
@Component({
  templateUrl: "app.html"
})
export class MyApp {
  rootPage: any = HomePage;
  @ViewChild(Nav) nav: Nav;
  constructor(
    private oneSignal: OneSignal,
    private platform: Platform,
    private geofence: Geofence,
    private alertCtrl: AlertController,
    private storage: Storage,
    public firebaseProvider: FirebaseProvider,
    statusBar: StatusBar,
    splashScreen: SplashScreen
  ) {
    // this.initializeApp();
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      storage.get("CurrentUser").then(val => {
        if (val) {
          console.log(val.role);
          if (val.role == 0) {
            this.nav.push(ClientlocationPage, { user: val });
          } else if (val.role == 1) {
            this.nav.push(AutocompletelocationPage, { user: val });
          }
        }
      });
      this.oneSignal.startInit(
        "9965736a-8118-414e-9084-b79a07d58f8b",
        "169673409052"
      );

      this.oneSignal.inFocusDisplaying(
        this.oneSignal.OSInFocusDisplayOption.InAppAlert
      );

      this.oneSignal.handleNotificationReceived().subscribe(() => {
        // do something when notification is received
        console.log("onesignal notification received");
        this.firebaseProvider.registerUser(this.storage.get("CurrentUser"));
        this.nav.push(PushalarmPage);
        // this.showAlert("onesignal notification received");
      });

      this.oneSignal.handleNotificationOpened().subscribe(() => {
        // do something when a notification is opened
        this.showAlert("onesignal notification opened");
        // this.nav.push(PushalarmPage);
      });

      this.oneSignal.endInit();

      console.log("initializing app");

      this.geofence.onTransitionReceived();
    });
  }
  showAlert(text) {
    let alert = this.alertCtrl.create({
      title: "Warning!",
      subTitle: text,
      buttons: [
        {
          text: "OK"
        }
      ]
    });
    alert.present();
  }
}

