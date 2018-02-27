import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController
} from "ionic-angular";
import { User } from "../../models/user";
import { AngularFireDatabase } from "angularfire2/database";
import { FirebaseProvider } from "../../providers/firebase/firebase";
import firebase from "firebase";
import { Http } from "@angular/http";
import { Storage } from "@ionic/storage";
import { SignupPage } from "../signup/signup";
import { ClientlocationPage } from "../clientlocation/clientlocation";
import { SetlocationPage } from "../setlocation/setlocation";
import { AutocompletelocationPage } from "../autocompletelocation/autocompletelocation";
import { ModalmapPage} from '../modalmap/modalmap';
import { Location } from "../../models/location";
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  public user = {} as User;
  public checkstate = 0;
  public locations : any;
  public location = {} as Location;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public afd: AngularFireDatabase,
    private alertCtrl: AlertController,
    public firebaseProvider: FirebaseProvider,
    public storage: Storage
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad LoginPage");
  }
  Login(user: User) {
    this.checkstate = 0;
    var that = this;

    var query = firebase
      .database()
      .ref("users")
      .orderByKey();

    query.once("value").then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        if (that.checkstate == 0) {
          if (childSnapshot.val().email == user.email) {
            that.checkstate = 1;
            if (childSnapshot.val().password == user.password) {
              that.checkstate = 2;
              that.user.fullName = childSnapshot.val().fullName;
              that.user.password = childSnapshot.val().password;
              that.user.email = childSnapshot.val().email;
              that.user.role = childSnapshot.val().role;
              that.storage.set("CurrentUser", that.user);
            }
          }
        }
      });

      if (that.checkstate == 0) {
        that.showAlert("Email and password are incorrect!");
      } else if (that.checkstate == 1) {
        that.showAlert("Password is incorrect!");
      } else {

        if (user.role == 0) {
          that.navCtrl.push(ClientlocationPage);
          console.log(that.storage.get("CurrentUser"));
        } else {
          that.navCtrl.push(AutocompletelocationPage);
          console.log(that.storage.get("CurrentUser"));
        }
      }
    });
  }
  goRegister() {
    this.navCtrl.push(SignupPage, {});
  }
  goForgotPassword() {
    // this.navCtrl.push(ForgotPasswordPage, {});
    this.showAlert("Not finished this function.");
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
