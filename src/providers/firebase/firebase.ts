import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";
import { AngularFireDatabase } from "angularfire2/database";
import firebase from "firebase";

@Injectable()
export class FirebaseProvider {
  public userData: any;
  public userKey: any;
  posNumber: number;

  constructor(public http: Http, public afd: AngularFireDatabase) {
    console.log("Hello FirebaseProvider Provider");
  }

  registerUser(user) {
    this.userData = user;
    var that = this;
    var firedb = firebase.database();

    this.afd.list("/users/").push(user);
    firedb
      .ref("users/")
      .limitToLast(1)
      .on("child_added", function(snapshot) {
        that.userKey = snapshot.ref.key;
      });

    firedb.ref("users/" + that.userKey + "/userkey").set(that.userKey);
  }

  addPosition(location) {
    var that = this;
    var query = firebase
      .database()
      .ref("location")
      .orderByKey();
    query.once("value").then(function(snapshot) {
      if (snapshot.numChildren() == 0) that.posNumber = 1;
      else {
        that.posNumber = snapshot.numChildren() + 1;
      }

      that.afd.list("/location/").push(location);
    });
  }

  // postLink(link) {
  //   this.afd.list('/link/' + this.userKey).push(link);
  //   var firedb = firebase.database();
  //   firedb.ref("link/" + this.userKey + "/name").set(this.userData.name);
  // }

  // uploadMessage(message, date) {
  //   this.afd.list('/message/').push(message);
  // }
  // add_Site(site) {
  //   this.afd.list('/site/').push(site);
  // }
}
