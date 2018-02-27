import { Component, ElementRef, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from "ionic-angular";
import { Geofence } from "@ionic-native/geofence";
import { Geolocation } from "@ionic-native/geolocation";
import { LocationProvider } from "../../providers/location/location";
import { Storage } from "@ionic/storage";
import { LoginPage } from "../login/login";
/**
 * Generated class for the ClientlocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;
@IonicPage()
@Component({
  selector: "page-clientlocation",
  templateUrl: "clientlocation.html"
})
export class ClientlocationPage {
  @ViewChild("map") mapElement: ElementRef;
  public map: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private geofence: Geofence,
    private geolocation: Geolocation,
    public storage: Storage,
    public LocationProvider: LocationProvider,
    public viewCtrl: ViewController
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad ClientlocationPage");
    this.mylocation();
  }
  logout() {
    this.storage.remove("CurrentUser");
    this.navCtrl.push(LoginPage);
  }
  mylocation() {
    this.geolocation
      .getCurrentPosition()
      .then(position => {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        let latLng = new google.maps.LatLng(lat, lng);
        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        this.map = new google.maps.Map(
          this.mapElement.nativeElement,
          mapOptions
        );
        this.addMarker(lat, lng);
        this.viewCircle();
      })
      .catch(error => {
        console.log("Error getting location", error);
      });
  }

  viewCircle() {
    var amsterdam = new google.maps.LatLng(
      this.LocationProvider.lat,
      this.LocationProvider.long
    );

    var cityCircle = new google.maps.Circle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      center: amsterdam,
      radius: this.LocationProvider.miles
    });
    console.log(amsterdam);
    cityCircle.setMap(this.map);
  }

  addMarker(lat, lng) {
    var marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: { lat: lat, lng: lng }
    });

    if (this.LocationProvider.position != null) {
      let content = this.LocationProvider.position;
      this.addInfoWindow(marker, content);
    }
  }

  addInfoWindow(marker, content) {
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, "click", () => {
      infoWindow.open(this.map, marker);
    });
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
