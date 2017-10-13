import {Injectable} from '@angular/core';
import {Configuration} from '../../configuration';
import {AngularFireDatabase} from 'angularfire2/database';

@Injectable()
export class NotificationsService {

    constructor(private db: AngularFireDatabase, private config: Configuration) {
    }

    getMyNotifications() {
        return this.db.list('notifications/' + this.config.userId);
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
}
