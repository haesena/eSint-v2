import {Injectable} from '@angular/core';
import {Configuration} from '../../configuration';
import {AngularFireDatabase} from 'angularfire2/database';
import {Wish} from '../../models/wish';

@Injectable()
export class WishlistsService {

    constructor(private db: AngularFireDatabase, private config: Configuration) {
    }

    createWishlist(name) {
        return this.db.object('wishlists/' + this.config.activeGroup + '/' + this.config.userId + '/name').update(name)
    }

    getWishes(uid) {
        return this.db.list('wishlists/' + this.config.activeGroup + '/' + uid + '/wishes');
    }

    getWish(wid) {
        return this.db.object('wishlists/' + this.config.activeGroup + '/' + this.config.userId + '/wishes/' + wid);
    }

    saveWish(wish: Wish) {
        if (wish.$key == null) {
            return this.db.list('wishlists/' + this.config.activeGroup + '/' + this.config.userId + '/wishes').push(wish);
        } else {
            return this.db.object('wishlists/' + this.config.activeGroup + '/' + this.config.userId + '/wishes/' + wish.$key).update(wish)
        }
    }

    getWishlist() {
        return this.db.object('wishlists/' + this.config.activeGroup + '/' + this.config.userId);
    }

    deleteWish(wid) {
        this.db.list('wishlists/' + this.config.activeGroup + '/' + this.config.userId + '/wishes').remove(wid);
    }

}
