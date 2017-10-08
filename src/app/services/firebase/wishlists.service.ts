import {Injectable} from '@angular/core';
import {Configuration} from '../../configuration';
import {AngularFireDatabase} from 'angularfire2/database';
import {Wish} from '../../models/wish';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class WishlistsService {

    constructor(private db: AngularFireDatabase, private config: Configuration) {
    }

    createWishlist(name) {
        return this.db.object('wishlists/' + this.config.activeGroup + '/' + this.config.userId + '/name').update(name)
    }

    getWishes(uid) {
        const wishes$ = new ReplaySubject();
        this.db.list('wishlists/' + this.config.activeGroup + '/' + uid + '/wishes').subscribe(wList => {
            const wishes = [];
            wList.forEach(wish => {
                this.db.object('deleteFlag/' + this.config.activeGroup + '/' + uid + '/' + wish.$key).subscribe(d => {
                    wish.deleted = d.$value;
                });
                wishes.push(wish);
            });
            wishes$.next(wishes);
        });
        return wishes$;
    }

    getWishesWithAdditionalInfos(uid) {
        const wishes$ = new ReplaySubject();
        this.db.list('wishlists/' + this.config.activeGroup + '/' + uid + '/wishes').subscribe(wList => {
            const wishes = [];
            wList.forEach(wish => {
                this.db.object('takenFlag/' + this.config.activeGroup + '/' + uid + '/' + wish.$key).subscribe(t => {
                    wish.taken = t.$value;
                });
                this.db.object('deleteFlag/' + this.config.activeGroup + '/' + uid + '/' + wish.$key).subscribe(d => {
                    wish.deleted = d.$value;
                });
                wishes.push(wish);
            });
            wishes$.next(wishes);
        });
        return wishes$;
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

    getWishlist(uid) {
        return this.db.object('wishlists/' + this.config.activeGroup + '/' + uid);
    }

    deleteWish(wid) {
        this.db.object('deleteFlag/' + this.config.activeGroup + '/' + this.config.userId + '/' + wid).set(true);
    }

    restoreWish(wid) {
        this.db.object('deleteFlag/' + this.config.activeGroup + '/' + this.config.userId + '/' + wid).remove();
    }

    getWishlistOfActiveGroup() {
        return this.config.activeGroup$.switchMap(ag => {
            const lists$ = new ReplaySubject();
            this.db.list('wishlists/' + ag).first().subscribe(lists => {
                const wLists = [];
                lists.forEach(list => {
                    if (list.$key === this.config.userId) {
                        return;
                    }
                    this.db.object('users/' + list.$key).subscribe(u => {
                        wLists.push({
                            name: list.name,
                            photoUrl: u.photoUrl,
                            lid: list.$key
                        });
                    });
                });
                lists$.next(wLists);
            });
            return lists$;
        });
    }

    takeWish(gid, uid, wid) {
        this.db.object('takenFlag/' + gid + '/' + uid + '/' + wid).set(true);
        this.db.list('gifts/' + gid + '/' + this.config.userId).push({
            wish: wid,
            user: uid
        });
    }

    untakeWish(gid, uid, wid) {
        this.db.object('takenFlag/' + gid + '/' + uid + '/' + wid).remove();
        this.db.list('gifts/' + gid + '/' + this.config.userId).first().subscribe(gList => {
            gList.forEach(g => {
                if (g.wish === wid) {
                    this.db.object('gifts/' + gid + '/' + this.config.userId + '/' + g.$key).remove();
                }
            });
        });
    }
}
