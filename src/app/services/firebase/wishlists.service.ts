import {Injectable} from '@angular/core';
import {Configuration} from '../../configuration';
import {AngularFireOfflineDatabase} from 'angularfire2-offline';
import {Wish} from '../../models/wish';
import 'rxjs/add/operator/switchMap';
import {AngularFireDatabase} from 'angularfire2/database';

@Injectable()
export class WishlistsService {

    constructor(private db: AngularFireOfflineDatabase, private config: Configuration, private wdb: AngularFireDatabase) {
    }

    getWishes(uid) {
        return this.db.list('wishlists/' + this.config.activeGroup + '/' + uid + '/wishes');
    }

    getWishesWithAdditionalInfos(uid) {
        return this.getWishes(uid).map(wList => {
            wList.forEach(wish => {
                this.db.object('takenFlag/' + this.config.activeGroup + '/' + uid + '/' + wish.$key).subscribe(t => {
                    wish.taken = t.$value;
                });
            });
            return wList
        });
    }

    getWish(wid) {
        return this.db.object('wishlists/' + this.config.activeGroup + '/' + this.config.userId + '/wishes/' + wid);
    }

    saveWish(wish: Wish) {
        if (wish.$key == null) {
            return this.wdb.list('wishlists/' + this.config.activeGroup + '/' + this.config.userId + '/wishes').push(wish);
        } else {
            return this.wdb.object('wishlists/' + this.config.activeGroup + '/' + this.config.userId + '/wishes/' + wish.$key).update(wish)
        }
    }

    getWishlist(uid) {
        return this.db.object('wishlists/' + this.config.activeGroup + '/' + uid);
    }

    deleteWish(wid) {
        this.wdb.object('wishlists/' + this.config.activeGroup + '/' + this.config.userId + '/wishes/' + wid).remove();
    }

    getWishlistOfActiveGroup() {
        return this.config.activeGroup$.switchMap(ag => {
            return this.db.list('wishlists/' + ag).first().map(lists => {
                lists.forEach(list => {
                    this.db.object('users/' + list.$key).subscribe(u => list.photoUrl = u.photoUrl);
                });
                // filter out the list of the current user
                return lists.filter(l => l.$key !== this.config.userId);
            });
        });
    }

    takeWish(gid, uid, wid) {
        this.wdb.object('takenFlag/' + gid + '/' + uid + '/' + wid).set(true);
        this.wdb.list('gifts/' + gid + '/' + this.config.userId).push({
            wish: wid,
            user: uid
        });
    }

    untakeWish(gid, uid, wid) {
        this.wdb.object('takenFlag/' + gid + '/' + uid + '/' + wid).remove();
        this.wdb.list('gifts/' + gid + '/' + this.config.userId).first().subscribe(gList => {
            gList.forEach(g => {
                if (g.wish === wid) {
                    this.wdb.object('gifts/' + gid + '/' + this.config.userId + '/' + g.$key).remove();
                }
            });
        });
    }
}
