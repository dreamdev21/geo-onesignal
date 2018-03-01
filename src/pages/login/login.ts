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
import { ModalmapPage } from "../modalmap/modalmap";
import { Location } from "../../models/location";
import { OneSignal } from "@ionic-native/onesignal";
import { ContentType } from "@angular/http/src/enums";
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
  public locations: any;
  public location = {} as Location;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public afd: AngularFireDatabase,
    private alertCtrl: AlertController,
    public firebaseProvider: FirebaseProvider,
    public storage: Storage,
    private OneSignal: OneSignal
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
    // this.showAlert("Not finished this function.");
    // var that = this;
    // that.locations = [];
    // var query = firebase
    //   .database()
    //   .ref("locations")
    //   .orderByKey();
    // query.once("value").then(function(snapshot) {
    //   snapshot.forEach(function(childSnapshot) {
    //     var location = { lat: [], lng: [], miles: [], attrUrl: [] };
    //     location.lat = childSnapshot.val().lat;
    //     location.lng = childSnapshot.val().lng;
    //     location.miles = childSnapshot.val().miles;
    //     location.attrUrl = childSnapshot.val().attrUrl;
    //     that.locations.push(location);
    //   });
    //   that.location = that.locations.pop();
    // });
    // that.sendNotificationwithImage(that.location);
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
  // sendNotificationwithImage(location) {
  //   console.log(location.val);
  //   window["plugins"].OneSignal.getIds(function(ids) {
  //     var notificationObj = {
  //       contents: { en: "message with image" },
  //       include_player_ids: [ids.userId],
  //       big_picture:
  //         "https://cdn.pixabay.com/photo/2017/09/16/16/09/sea-2755908_960_720.jpg",
  //       ios_attachments: {
  //         id1:
  //           "https://cdn.pixabay.com/photo/2017/09/16/16/09/sea-2755908_960_720.jpg"
  //       },
  //       filters: [
  //         { field: "location", key: "radius", relation: "=", value: "1000" },
  //         { field: "location", key: "lat", relation: "=", value: "10" },
  //         { field: "location", key: "long", relation: "=", value: "10" }
  //       ],
  //       otherParameters: {
  //         // Headers: {Content-Type: "application/json"},
  //         "Autorization": "Basic NWI0ZjlhYTktNDUwZi00NDZjLWE0ZTgtNTc4NmEwY2IzODA0",
  //         "Content-Type": "application/json"
  //       }
  //     };

  //     window["plugins"].OneSignal.postNotification(
  //       notificationObj,
  //       function(successResponse) {
  //         console.log("Notification Post Success:", successResponse);
  //       },
  //       function(failedResponse) {
  //         console.log("Notification Post Failed: ", failedResponse);
  //         alert("Notification Post Failed:\n" + JSON.stringify(failedResponse));
  //       }
  //     );
  //   });
  // }
  // getOneSignalPlayerId() {
  //   window["plugins"].OneSignal.getPermissionSubscriptionState(function(
  //     status
  //   ) {
  //     status.permissionStatus.hasPrompted;
  //     status.permissionStatus.status;

  //     status.subscriptionStatus.subscribed;
  //     status.subscriptionStatus.userSubscriptionSetting;
  //     status.subscriptionStatus.pushToken;

  //     //var playerID = status.subscriptionStatus.userId;
  //     return status.subscriptionStatus.userId;
  //   });
  // }

  // // prompt user to accept sending location data
  // promptLocation() {
  //   window["plugins"].OneSignal.promptLocation();
  //   console.log("location prompted");
  // }
}
