import {Injectable} from '@angular/core';
import {Configuration} from '../../configuration';
import * as firebase from 'firebase';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {AngularFireOfflineDatabase} from 'angularfire2-offline';
import {AngularFireDatabase} from 'angularfire2/database';

@Injectable()
export class NotificationsService {

    messaging = firebase.messaging();

    constructor(private db: AngularFireOfflineDatabase, private config: Configuration, private wdb: AngularFireDatabase) {
    }

    getNotificationCount(uid) {
        return this.wdb.object('users/' + uid + '/notificationCount');
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
        this.wdb.object('notifications/' + this.config.userId + '/' + nid + '/seen').set(true);
    }

    deleteNotification(nid) {
        this.wdb.object('notifications/' + this.config.userId + '/' + nid).remove();
    }

    deleteAllNotifications() {
        this.wdb.object('notifications/' + this.config.userId).remove();
    }

    wishlistSubscribed(uid) {
        return this.db.object('wishlists/' + this.config.activeGroup + '/' + uid + '/subscriptions/' + this.config.userId);
    }

    subscribeToWishlist(uid, value) {
        this.wdb.object('wishlists/' + this.config.activeGroup + '/' + uid + '/subscriptions/' + this.config.userId).set(value);
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
                return this.messaging.getToken()
            })
            .then(token => {
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
            this.wdb.list('fcmTokens/' + this.config.userId).push(token).then(v => {
                localStorage.setItem('fcmDeviceKey', v.key);
            });
        } else {
            const data = {[fcmDeviceKey]: token};
            this.wdb.object('fcmTokens/' + this.config.userId).update(data);
        }
    }

    listenForTokenRefresh() {
        this.messaging.onTokenRefresh(function() {
            this.messaging.getToken()
                .then(refreshedToken => {
                    this.updateToken(refreshedToken);
                })
                .catch(function(err) {
                    console.log('Unable to retrieve refreshed token ', err);
                });
        });
    }

}
