import {Injectable} from '@angular/core';
import {Configuration} from '../../configuration';
import {AngularFireDatabase} from 'angularfire2/database';
import {ReplaySubject} from 'rxjs/ReplaySubject';

@Injectable()
export class GiftsService {

    constructor(private db: AngularFireDatabase, private config: Configuration) {
    }

    getMyGiftIds() {
        return this.db.list('gifts/' + this.config.activeGroup + '/' + this.config.userId);
    }

    getMyGifts() {
        const gifts$ = new ReplaySubject();
        this.db.list('gifts/' + this.config.activeGroup + '/' + this.config.userId).subscribe(gList => {
            const gifts = [];
            gList.forEach(g => {
                if (typeof g.user !== 'string') {
                    return;
                }
                this.db.object('users/' + g.user).subscribe(u => {
                    g['user'] = u;
                });
                if (g.wish) {
                    this.db.object('wishlists/' + this.config.activeGroup + '/' + g.user + '/wishes/' + g.wish).subscribe(w => {
                        g['name'] = w.name;
                    });
                } else {
                    g['manualAdd'] = true;
                }
                gifts.push(g);
            });
            gifts$.next(gifts);
        });
        return gifts$;
    }

    saveGift(gift) {
        gift.manualAdd = true;
        if (gift.$key == null) {
            return this.db.list('gifts/' + this.config.activeGroup + '/' + this.config.userId).push(gift);
        } else {
            return this.db.object('gifts/' + this.config.activeGroup + '/' + this.config.userId + '/' + gift.$key).update(gift)
        }
    }

    getGift(gid) {
        return this.db.object('gifts/' + this.config.activeGroup + '/' + this.config.userId + '/' + gid);
    }

    deleteGift(gift) {
        console.log(gift);
        if (gift.wish !== undefined) {
            this.db.object('takenFlag/' + this.config.activeGroup + '/' + gift.user.uid + '/' + gift.wish).remove();
            console.log('delete: takenFlag/' + this.config.activeGroup + '/' + gift.user.uid + '/' + gift.wish);
        }
        console.log('delete: gifts/' + this.config.activeGroup + '/' + this.config.userId + '/' + gift.$key);
        this.db.object('gifts/' + this.config.activeGroup + '/' + this.config.userId + '/' + gift.$key).remove();
    }

}
