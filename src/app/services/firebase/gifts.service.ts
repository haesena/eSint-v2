import {Injectable} from '@angular/core';
import {Configuration} from '../../configuration';
import {AngularFireOfflineDatabase} from 'angularfire2-offline';
import {AngularFireDatabase} from 'angularfire2/database';

@Injectable()
export class GiftsService {

    constructor(private db: AngularFireOfflineDatabase, private config: Configuration, private wdb: AngularFireDatabase) {
    }

    getMyGiftIds() {
        return this.db.list('gifts/' + this.config.activeGroup + '/' + this.config.userId);
    }

    getMyGifts() {
        return this.db.list('gifts/' + this.config.activeGroup + '/' + this.config.userId).map(gList => {
            gList.forEach(g => {
                this.db.object('users/' + g.user).subscribe(u => g.userObj = u);
                if (g.wish) {
                    this.db.object('wishlists/' + this.config.activeGroup + '/' + g.user + '/wishes/' + g.wish)
                        .subscribe(w => g.name = w.name);
                }
            });

            return gList;
        });
    }

    saveGift(gift) {
        gift.manualAdd = true;
        if (gift.$key == null) {
            return this.wdb.list('gifts/' + this.config.activeGroup + '/' + this.config.userId).push(gift);
        } else {
            return this.wdb.object('gifts/' + this.config.activeGroup + '/' + this.config.userId + '/' + gift.$key).update(gift)
        }
    }

    getGift(gid) {
        return this.db.object('gifts/' + this.config.activeGroup + '/' + this.config.userId + '/' + gid);
    }

    deleteGift(gift) {
        if (gift.wish !== undefined) {
            this.wdb.object('takenFlag/' + this.config.activeGroup + '/' + gift.user + '/' + gift.wish).remove();
        }
        this.wdb.object('gifts/' + this.config.activeGroup + '/' + this.config.userId + '/' + gift.$key).remove();
    }

}
