import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { ModalController, Platform } from "ionic-angular";
import "rxjs/add/operator/map";
import { ClientlocationPage } from "../../pages/clientlocation/clientlocation";
import {
  NativeGeocoder,
  NativeGeocoderReverseResult
} from "@ionic-native/native-geocoder";
import { FirebaseProvider } from "../../providers/firebase/firebase";
import { Geofence } from "@ionic-native/geofence";
import firebase from "firebase";

@Injectable()
export class LocationProvider {
  position: string;
  lat: number;
  long: number;
  miles: number;
  constructor(
    public http: Http,
    public nativeGeocoder: NativeGeocoder,
    public firebaseProvider: FirebaseProvider,
    public geofence: Geofence,
    public modalCtrl: ModalController
  ) {
    console.log("Hello LocationProvider Provider");
  }

  public getAddress(lat, lng) {
    this.nativeGeocoder
      .reverseGeocode(lat, lng)
      .then((result: NativeGeocoderReverseResult) => {
        this.position =
          JSON.stringify(result["thoroughfare"]) +
          ", " +
          JSON.stringify(result["locality"]) +
          " in " +
          result.countryName;
      })
      .catch((error: any) => console.log(error));
  }

  public startGeofence() {
    var that = this;
    var query = firebase
      .database()
      .ref("location")
      .orderByKey();
    query.once("value").then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        that.lat = parseFloat(childSnapshot.val().lat);
        that.long = parseFloat(childSnapshot.val().long);
        that.miles = parseFloat(childSnapshot.val().miles) * 1609;

        // that.getAddress(that.lat, that.long);
        that.geofence.initialize().then(
          () => {
            console.log("Geofence Plugin Ready!");
            that.addGeofence();
          },
          err => {
            console.log(err);
          }
        );
      });
    });
  }

  public addGeofence() {
    let fence = {
      id: "69ca1b88-6fbe-4e80-a4d4-ff4d3748acdb", //any unique ID
      latitude: this.lat, //center of geofence radius
      longitude: this.long,
      radius: this.miles, //radius to edge of geofence in meters
      transitionType: 3, // 'Transition Types'
      notification: {
        //notification settings
        id: 1, //any unique ID
        title: "You crossed a fence", //notification title
        text: "You just arrived", //notification body
        openAppOnClick: true //open app when notification is tapped
      }
    };

    this.geofence
      .addOrUpdate(fence)
      .then(
        () => console.log("Geofence added"),
        err => console.log("Geofence failed to add")
      );

    // this.geofence.onNotificationClicked = function (notificationData) {
    //   console.log('App opened from Geo Notification!', notificationData);
    // };
  }
}
