import 'rxjs/add/operator/map';
import {AngularFireOfflineDatabase} from 'angularfire2-offline';
import {Injectable} from '@angular/core';
import {Configuration} from '../../configuration';
import {UserService} from './user.service';
import {Group} from '../../models/group';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import {AngularFireDatabase} from 'angularfire2/database';

@Injectable()
export class GroupsService {
    constructor(public db: AngularFireOfflineDatabase, public config: Configuration, public userService: UserService,
                private wdb: AngularFireDatabase) {
    }

    getUserGroups(uid) {
        return this.db.list('users/' + uid + '/groups').map(gList => {
            gList.forEach(group => {
                group.users = [];
                this.db.object('groups/' + group.$key).subscribe(g => {
                    group.name = g.name;
                    group.description = g.description;
                    group.users = g.users;
                });
            });
            return gList;
        });
    }

    getUserGroupIds(uid) {
        return this.db.object('users/' + uid + '/groups');
    }

    getGroupUsers(gid) {
        return this.db.list('groups/' + gid + '/users').map(uList => {
            uList.forEach(user => {
                this.db.object('users/' + user.$key).subscribe(u => {
                    user.displayName = u.displayName;
                    user.photoUrl = u.photoUrl;
                });
            });
            return uList;
        });
    }

    removeUserFromGroup(gid, uid) {
        const users = this.wdb.list('/groups/' + gid + '/users');
        return users.map(u => {
            if (u.length === 1) {
                this.wdb.list('/groups').remove(gid);
            } else {
                users.remove(uid);
            }
        });
    }

    getGroup(gid) {
        return this.db.object('groups/' + gid);
    }

    createGroup(g: Group): Observable<string> {
        g.users = {[this.config.userId]: 'creator'};
        return Observable.fromPromise(this.wdb.list('/groups').push(g)).map(v => v.key);
    }

    saveGroup(group: Group) {
        this.wdb.object('groups/' + group.$key).update(group);
    }


    addUser(gid, uid, type) {
        return this.wdb.object('groups/' + gid + '/users').update({[uid]: type});
    }
}
