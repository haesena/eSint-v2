import {Injectable} from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import {User} from '../../models/user';
import 'rxjs/add/operator/mergeMap';
import {Configuration} from '../../configuration';
import {WishlistsService} from './wishlists.service';

@Injectable()
export class UserService {

    public user: User;
    public user$: FirebaseObjectObservable<User>;

    constructor(public db: AngularFireDatabase, public config: Configuration) {
    }

    getUser(uid: string) {
        return this.db.object('users/' + uid);
    }

    setUser(user: any) {
        this.user = new User();
        this.user.uid = user.uid;
        this.user.photoUrl = user.providerData[0].photoURL;
        if (user.displayName != null) {
            this.user.displayName = user.displayName;
        } else {
            this.user.displayName = user.email;
        }
        this.user$ = this.db.object('users/' + user.uid);
        this.config.loading = true;
        this.user$.subscribe(fbUser => {
            this.config.loading = false;
            this.config.activeGroup = fbUser.activeGroup;
            this.config.activeGroup$.next(fbUser.activeGroup);
            if (fbUser.displayName != null && fbUser.displayName !== this.user.displayName) {
                this.user.displayName = fbUser.displayName;
            }
            this.db.object('users/' + user.uid).update(this.user);
        });
    }
    addGroup(gid: string, type: string) {
        const newGroup = {};
        newGroup[gid] = type;
        const userGroups = this.db.object('users/' + this.config.userId + '/groups');
        return userGroups.update(newGroup);
    }

    setActiveGroup(gid) {
        this.config.activeGroup = gid;
        this.config.activeGroup$.next(gid);
        this.user.activeGroup = gid;
        this.db.object('users/' + this.user.uid).update(this.user);
    }

    getActiveGroupName() {
        return this.db.object('groups/' + this.config.activeGroup + '/name');
    }

    removeGroupFromUser(uid, gid) {
        const groups = this.db.list('/users/' + uid + '/groups');
        groups.remove(gid);
        if (this.config.activeGroup === gid) {
            groups.subscribe(g => {
                this.setActiveGroup(g[0].$key);
            });
        }
    }

    getUserGroups(uid) {
        return this.db.list('users/' + uid + '/groups');
    }
}
