import {Injectable} from '@angular/core';
import {AngularFireOfflineDatabase, AfoObjectObservable} from 'angularfire2-offline';
import {User} from '../../models/user';
import 'rxjs/add/operator/mergeMap';
import {Configuration} from '../../configuration';
import {AngularFireDatabase} from 'angularfire2/database';
import {isNullOrUndefined} from 'util';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class UserService {

    public user: User;
    public user$: AfoObjectObservable<User>;

    constructor(public db: AngularFireOfflineDatabase, public config: Configuration, private wdb: AngularFireDatabase) {
    }

    setUser(user: any) {
        this.user = new User();
        this.user.uid = user.uid;
        this.user.photoUrl = user.providerData[0].photoURL;
        if (this.user.photoUrl === null) {
            this.user.photoUrl = 'assets/images/user-default.png';
        }
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
            this.wdb.object('users/' + user.uid).update(this.user);
        });
    }

    addGroup(gid: string, type: string) {
        return this.wdb.object('users/' + this.config.userId + '/groups').update({[gid]: type});
    }

    setActiveGroup(gid) {
        this.config.activeGroup = gid;
        this.config.activeGroup$.next(gid);
        this.user.activeGroup = gid;
        if (gid === null) {
            return this.wdb.object('users/' + this.user.uid + '/activeGroup').remove();
        } else {
            return this.wdb.object('users/' + this.user.uid).update(this.user);
        }
    }

    getActiveGroupName() {
        return this.config.activeGroup$.switchMap(ag => {
            if (isNullOrUndefined(ag)) {
                return Observable.of({$value: null});
            } else {
                return this.db.object('groups/' + this.config.activeGroup + '/name');
            }
        })
    }

    removeGroupFromUser(uid, gid) {
        return this.wdb.list('/users/' + uid + '/groups').map(g => {
            if (g.length === 0) {
                return this.setActiveGroup(null);
            } else {
                return this.setActiveGroup(g[0].$key);
            }
        }).subscribe(() => {
            this.wdb.list('/users/' + uid + '/groups/' + gid).remove();
        });
    }

    getUserGroups(uid) {
        return this.db.list('users/' + uid + '/groups');
    }
}
