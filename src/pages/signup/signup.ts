import { LoginPage } from "../login/login";
import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  Loading,
  LoadingController,
  ToastController
} from "ionic-angular";
import { User } from "../../models/user";
import { AngularFireDatabase } from "angularfire2/database";
import { FirebaseProvider } from "../../providers/firebase/firebase";
import firebase from "firebase";
import { Http } from "@angular/http";
import { Geofence } from "@ionic-native/geofence";

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-signup",
  templateUrl: "signup.html"
})
export class SignupPage {
  public user = {} as User;
  constructor(
    public http: Http,
    public afd: AngularFireDatabase,
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public navParams: NavParams,
    public firebaseProvider: FirebaseProvider,
    private geofence: Geofence
  ) {
    this.http = http;
    geofence.initialize().then(
      // resolved promise does not return a value
      () => console.log("Geofence Plugin Ready"),
      err => console.log(err)
    );
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad SignupPage");
  }
  register() {
    console.log(this.user);
    if (this.validateEmail(this.user.email) == false) {
      let toast = this.toastCtrl.create({
        message: "Please fill a correct email",
        duration: 3000,
        position: "top"
      });
      toast.present();
    } else {
      this.user.role = 0;
      this.firebaseProvider.registerUser(this.user);
      let toast = this.toastCtrl.create({
        message: "You are registered successfully!",
        duration: 3000,
        position: "top"
      });
      toast.present();
      this.addGeofence();
      this.navCtrl.push(LoginPage);
    }
  }
  private addGeofence() {
    //options describing geofence
    let fence = { id: "69ca1b88-6fbe-4e80-a4d4-ff4d3748acdb", latitude: 11.5370418, longitude: 104.9051513, radius: 100, transitionType: 3, notification: { //notification settings //any unique ID //center of geofence radius //radius to edge of geofence in meters //see 'Transition Types' below
        id: 1, title: "You crossed a fence", text: "You just arrived to Gliwice city center.", openAppOnClick: true } }; //any unique ID //notification title //notification body //open app when notification is tapped

    this.geofence
      .addOrUpdate(fence)
      .then(
        () => console.log("Geofence added"),
        err => console.log("Geofence failed to add")
      );
  }
  validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
}
