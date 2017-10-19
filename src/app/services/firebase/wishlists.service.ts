import {Injectable} from '@angular/core';
import {Configuration} from '../../configuration';
import {AngularFireOfflineDatabase} from 'angularfire2-offline';
import {Wish} from '../../models/wish';
import 'rxjs/add/operator/switchMap';
import {AngularFireDatabase} from 'angularfire2/database';
import {isNullOrUndefined} from 'util';

@Injectable()
export class WishlistsService {

    constructor(private db: AngularFireOfflineDatabase, private config: Configuration, private wdb: AngularFireDatabase) {
    }

    getWishes(uid) {
        return this.getWishlistId(this.config.activeGroup, uid).switchMap(lid => {
            return this.db.list('wishlists/' + this.config.activeGroup + '/' + lid + '/wishes');
        });
    }

    getWishlistId(groupId, userId) {
        return this.db.object('wishlists/' + groupId + '/' + userId + '/referenceId').map(id => {
            if (id.$value === null) {
                return userId;
            } else {
                return id.$value;
            }
        });
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
        return this.getWishlistId(this.config.activeGroup, this.config.userId).subscribe(lid => {
            if (wish.$key == null) {
                return this.wdb.list('wishlists/' + this.config.activeGroup + '/' + lid + '/wishes').push(wish);
            } else {
                return this.wdb.object('wishlists/' + this.config.activeGroup + '/' + lid + '/wishes/' + wish.$key).update(wish);
            }
        });
    }

    getWishlist(uid) {
        return this.getWishlistId(this.config.activeGroup, uid).switchMap(lid => {
            return this.db.object('wishlists/' + this.config.activeGroup + '/' + lid).map(wishlist => {
                if (!isNullOrUndefined(wishlist.sharedWith)) {
                    wishlist.users = [];
                    this.db.object('users/' + lid).subscribe(user => {
                        wishlist.users.push(user);
                    });
                    for (const u in wishlist.sharedWith) {
                        if (!wishlist.sharedWith.hasOwnProperty(u)) {
                            continue;
                        }
                        this.db.object('users/' + u).subscribe(user => {
                            wishlist.users.push(user);
                        });
                    }
                }
                return wishlist;
            });
        });
    }

    updateWishlist(newFields) {
        return this.getWishlistId(this.config.activeGroup, this.config.userId).subscribe(lid => {
            return this.db.object('wishlists/' + this.config.activeGroup + '/' + lid).update(newFields);
        });
    }

    deleteWish(wid) {
        return this.getWishlistId(this.config.activeGroup, this.config.userId).subscribe(lid => {
            this.wdb.object('wishlists/' + this.config.activeGroup + '/' + lid + '/wishes/' + wid).remove();
        });
    }

    getWishlistOfActiveGroup() {
        return this.config.activeGroup$.switchMap(ag => {
            return this.db.list('wishlists/' + ag).first().map(lists => {
                lists.forEach(list => {
                    this.db.object('users/' + list.$key).subscribe(u => list.photoUrl = u.photoUrl);
                });
                console.log(lists);
                // filter out the list of the current user
                return lists.filter(l => {
                    // if i'm a collaborator of this list, filter it out
                    if (!isNullOrUndefined(l.sharedWith)) {
                        if (l.sharedWith[this.config.userId] === true) {
                            return false;
                        }
                    }

                    // if this is a list of a collaborator of my list, filter it out
                    if (!isNullOrUndefined(l.referenceId)) {
                        return false;
                    }

                    // if it's my list, filter it out
                    return l.$key !== this.config.userId;
                });
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

    joinWishlist(userId, groupId, wishlistToJoin) {
        return this.wdb.object('wishlists/' + groupId + '/' + userId).update({referenceId: wishlistToJoin})
            .then(() => {
                return this.wdb.object('wishlists/' + groupId + '/' + wishlistToJoin + '/sharedWith').update({[userId]: true});
            }).then(() => {
                // if the user already took gifts for the wishlist wich he is joining, these gifts get deleted
                return this.wdb.list('gifts/' + groupId + '/' + userId).take(1).subscribe(gifts => {
                    gifts.forEach(gift => {
                        if (gift.user === wishlistToJoin && gift.manualAdd !== true) {
                            this.wdb.object('gifts/' + groupId + '/' + userId + '/' + gift.$key).remove();
                            this.wdb.object('takenFlag/' + groupId + '/' + wishlistToJoin + '/' + gift.wish).remove();
                        }
                    })
                });
            });
    }

    mergeWishes(userId, groupId, newListId) {
        this.wdb.list('wishlists/' + groupId + '/' + userId + '/wishes').take(1).subscribe(wishes => {
            console.log('inserting into wishlists/' + groupId + '/' + newListId + '/wishes');
            wishes.forEach(wish => {
                this.wdb.list('wishlists/' + groupId + '/' + newListId + '/wishes').push(wish);
            });
            this.wdb.list('wishlists/' + groupId + '/' + userId + '/wishes').remove();
        });
    }

    removeUserFromSharedList(userId) {
        this.getWishlistId(this.config.activeGroup, userId).take(1).subscribe(lid => {
            this.wdb.object('wishlists/' + this.config.activeGroup + '/' + lid + '/sharedWith/' + userId).remove();
            this.wdb.object('wishlists/' + this.config.activeGroup + '/' + userId + '/referenceId').remove();
        });
    }
}
