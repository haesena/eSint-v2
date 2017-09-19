import {Injectable} from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import {User} from '../../models/user';
import * as firebase from 'firebase/app';
import {Observable} from 'rxjs/Observable';
import {Configuration} from '../../configuration';

@Injectable()
export class UserService {

    private user: User;
    public user$: FirebaseObjectObservable<User>;

    constructor(public db: AngularFireDatabase, public config: Configuration) {
    }

    getUser(uid: string) {
        return this.db.object('users/' + uid);
    }

    setUser(user: firebase.User) {
        this.user = new User();
        this.user.uid = user.uid;
        this.user.photoUrl = user.photoURL;
        if (user.displayName != null) {
            this.user.displayName = user.displayName;
        } else {
            this.user.displayName = user.email;
        }
        this.user$ = this.db.object('users/' + user.uid);
        this.config.loading = true;
        this.user$.subscribe(
            fbUser => {
                this.config.loading = false;
                if (fbUser.displayName != null && fbUser.displayName !== this.user.displayName) {
                    this.user.displayName = fbUser.displayName;
                }
                if (fbUser.photoUrl != null && fbUser.photoUrl !== this.user.photoUrl) {
                    this.user.photoUrl = fbUser.photoUrl;
                }
                this.db.object('users/' + user.uid).update(this.user);
            }
        );
    }
    addGroup(gid: string, type: string) {
        const newGroup = {};
        newGroup[gid] = type;
        const userGroups = this.db.object('users/' + this.config.userId + '/groups');
        userGroups.update(newGroup);
    }
    setActiveGroup(gid) {
        this.user.activeGroup = gid;
        this.db.object('users/' + this.user.uid).update(this.user);
    }

}
