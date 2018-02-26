import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController
} from "ionic-angular";
import { AngularFireDatabase } from "angularfire2/database";
import { FirebaseProvider } from "../../providers/firebase/firebase";
import firebase from "firebase";
import { Http } from "@angular/http";
import { Location } from "../../models/location";
/**
 * Generated class for the PushalarmPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-pushalarm",
  templateUrl: "pushalarm.html"
})
export class PushalarmPage {

  public user: any;
  public locations: any;
  public location = {} as Location;

  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public afd: AngularFireDatabase,
    public firebaseProvider: FirebaseProvider
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad PushalarmPage");
    var that = this;
    that.locations = [];
    var query = firebase
      .database()
      .ref("locations")
      .orderByKey();
    query.once("value").then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var location = { lat:[],lng:[],miles:[],attrUrl:[] };
        location.lat = childSnapshot.val().lat;
        location.lng = childSnapshot.val().lng;
        location.miles = childSnapshot.val().miles;
        location.attrUrl = childSnapshot.val().attrUrl;
        that.locations.push(location);
      });
      that.location = that.locations.pop();
    });
  }
}
