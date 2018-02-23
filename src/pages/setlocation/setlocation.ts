import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  AlertController,
  Loading,
  LoadingController,
  ToastController,
  ActionSheetController
} from "ionic-angular";
import { LoginPage } from "../login/login";
import { Location } from "../../models/location";
import { Storage } from "@ionic/storage";
import { AngularFireDatabase } from "angularfire2/database";
import { FirebaseProvider } from "../../providers/firebase/firebase";
import firebase from "firebase";
import { Http } from "@angular/http";
import { Camera } from "@ionic-native/camera";
// import { ModalController } from "ionic-angular";


/**
 * Generated class for the SetlocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-setlocation",
  templateUrl: "setlocation.html"
})
export class SetlocationPage {
  loading: Loading;
  public location = {} as Location;
  public captureDataUrl: string;
  firestore = firebase.storage();
  public storageDirectory: string;
  public data;
  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public http: Http,
    private camera: Camera,
    public afd: AngularFireDatabase,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public firebaseProvider: FirebaseProvider
  ) {
    this.data = navParams.get("data");
    this.location.lat = this.data.lat;
    this.location.lng = this.data.lng;
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad SetlocationPage");
    console.log(this.data);
  }
  SaveLocation() {
    var that = this;
    var firedb = firebase.database();
    if (that.location.lat) {
      if (that.location.lng) {
        if (that.location.miles) {
          if (that.location.attrUrl) {
            this.afd.list("/locations/").push(that.location);
            this.dismiss();
            that.presentToast("Location Set Successfully!");
          } else {
            that.presentToast("Please Upload Image");
          }
        } else {
          that.presentToast("Please enter Miles");
        }
      } else {
        that.presentToast("Please enter Longitude");
      }
    } else {
      that.presentToast("Please enter Latitude");
    }

    // firedb
    //   .ref("users/")
    //   .limitToLast(1)
    //   .on("child_added", function(snapshot) {
    //     that.userKey = snapshot.ref.key;
    //   });

    // firedb.ref("users/" + that.userKey + "/userkey").set(that.userKey);
  }
  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: "Select Image Source",
      buttons: [
        {
          text: "Load from Library",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: "Use Camera",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: "Cancel",
          role: "cancel"
        }
      ]
    });
    actionSheet.present();
  }
  public takePicture(sourceType) {
    var options = {
      quality: 100,
      allowEdit: true,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then(
      imagePath => {
        this.captureDataUrl = "data:image/jpeg;base64," + imagePath;
        this.uploadImage();
      },
      err => {
        this.presentToast("Selecting image canceled.");
      }
    );
  }
  public uploadImage() {
    if (this.captureDataUrl != undefined) {
      let storageRef = firebase.storage().ref();
      var filename = Math.floor(Date.now() / 1000);

      const imageRef = storageRef.child(`images/${filename}.jpg`);

      this.loading = this.loadingCtrl.create({
        content: "Uploading..."
      });
      this.loading.present();

      imageRef
        .putString(this.captureDataUrl, firebase.storage.StringFormat.DATA_URL)
        .then(
          snapshot => {
            this.loading.dismissAll();
            this.presentToast("Upload Success!");
            this.firestore
              .ref()
              .child(`images/${filename}.jpg`)
              .getDownloadURL()
              .then(url => {
                this.location.attrUrl = url;
              });
          },
          err => {
            this.loading.dismissAll();
            this.presentToast("Upload Failed!");
          }
        );
    } else {
      this.showAlert("Please select an image.");
    }
  }
  presentToast(text) {
    const toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: "top"
    });

    toast.onDidDismiss(() => {
      console.log("Dismissed toast");
    });

    toast.present();
  }
  showLoading(text) {
    this.loading = this.loadingCtrl.create({
      content: text,
      dismissOnPageChange: true,
      showBackdrop: false
    });
    this.loading.present();
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
  dismiss() {
    let data = this.location;
    this.viewCtrl.dismiss(data);
  }
  // previewLocation() {
  //   if (this.location.lat) {
  //     if (this.location.lng) {
  //       if (this.location.miles) {
  //         var data = {
  //           lat: Number(this.location.lat),
  //           lng: Number(this.location.lng),
  //           miles: Number(this.location.miles)
  //         };
  //         // var modalPage = this.modalCtrl.create("ModalmapPage", data);
  //         modalPage.present();
  //       } else {
  //         this.presentToast("Please enter Miles");
  //       }
  //     } else {
  //       this.presentToast("Please enter Longitude");
  //     }
  //   } else {
  //     this.presentToast("Please enter Latitude");
  //   }
  // }
}
