import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { OneSignal } from "@ionic-native/onesignal";
import { LoginPage } from '../pages/login/login';
import { Geofence } from '@ionic-native/geofence';
@Component({
  templateUrl: "app.html"
})
export class MyApp {
  rootPage: any = LoginPage;

  constructor(
    private oneSignal: OneSignal,
    private platform: Platform,
    private geofence:Geofence,
    statusBar: StatusBar,
    splashScreen: SplashScreen
  ) {
    // this.initializeApp();
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.oneSignal.startInit("9965736a-8118-414e-9084-b79a07d58f8b", "169673409052");

      this.oneSignal.inFocusDisplaying(
        this.oneSignal.OSInFocusDisplayOption.InAppAlert
      );

      this.oneSignal.handleNotificationReceived().subscribe(() => {
        // do something when notification is received
      });

      this.oneSignal.handleNotificationOpened().subscribe(() => {
        // do something when a notification is opened
      });

      this.oneSignal.endInit();

      console.log("initializing app");

      this.geofence.onTransitionReceived(
      );

    });
  }

}

