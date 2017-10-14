import {Injectable} from '@angular/core';
import {Configuration} from '../../configuration';
import {AngularFireDatabase} from 'angularfire2/database';
import * as firebase from 'firebase';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Injectable()
export class NotificationsService {

    messaging = firebase.messaging();

    constructor(private db: AngularFireDatabase, private config: Configuration) {
    }

    getMyNotifications() {
        return this.db.list('notifications/' + this.config.userId, {
            query: {
                orderByChild: 'time'
            }
        }).map(nList => {
            nList.forEach(n => {
                this.db.object('users/' + n.refUser).subscribe(u => {
                    n.avatar = u.photoUrl;
                });
            });
            return nList;
        });
    }

    markAsRead(nid) {
        this.db.object('notifications/' + this.config.userId + '/' + nid + '/seen').set(true);
    }

    wishlistSubscribed(uid) {
        return this.db.object('wishlists/' + this.config.activeGroup + '/' + uid + '/subscriptions/' + this.config.userId);
    }

    subscribeToWishlist(uid, value) {
        this.db.object('wishlists/' + this.config.activeGroup + '/' + uid + '/subscriptions/' + this.config.userId).set(value);
    }

    pushActivated(uid) {
        const fcmDeviceKey = localStorage.getItem('fcmDeviceKey');

        if (fcmDeviceKey === null) {
            return Observable.of(false);
        } else {
            return this.db.object('fcmTokens/' + uid + '/' + fcmDeviceKey).map(token => {
                return token.$value !== null;
            });
        }
    }

    activatePushNotifications() {
        this.messaging.requestPermission()
            .then(() => {
                console.log('Notification permission granted.');
                return this.messaging.getToken()
            })
            .then(token => {
                console.log('received token: ' + token);
                this.updateToken(token);
                return true;
            })
            .catch((err) => {
                console.log('Unable to get permission to notify.', err);
                return false;
            });
    }

    updateToken(token) {
        const fcmDeviceKey = localStorage.getItem('fcmDeviceKey');

        if (fcmDeviceKey === null) {
            this.db.list('fcmTokens/' + this.config.userId).push(token).then(v => {
                localStorage.setItem('fcmDeviceKey', v.key);
            });
        } else {
            this.db.object('fcmTokens/' + this.config.userId + '/' + fcmDeviceKey).update(token);
        }
    }

    listenForTokenRefresh() {
        this.messaging.onTokenRefresh(function() {
            this.messaging.getToken()
                .then(refreshedToken => {
                    console.log('Token refreshed: ' + refreshedToken);
                    this.updateToken(refreshedToken);
                })
                .catch(function(err) {
                    console.log('Unable to retrieve refreshed token ', err);
                });
        });
    }

}
