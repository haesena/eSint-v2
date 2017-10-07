import 'rxjs/add/operator/map';
import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {Configuration} from '../../configuration';
import {UserService} from './user.service';
import {Group} from '../../models/group';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/first';
import {ReplaySubject} from 'rxjs/ReplaySubject';

@Injectable()
export class GroupsService {
    constructor(public db: AngularFireDatabase, public config: Configuration, public userService: UserService) {
    }

    getUserGroups(uid) {
        const groups$ = new ReplaySubject();
        this.db.list('users/' + uid + '/groups').subscribe(gList => {
            const groups = [];
            gList.forEach(group => {
                this.db.object('groups/' + group.$key).subscribe(g => {
                    groups.push(g);
                });
            });
            groups$.next(groups);
        });
        return groups$;
    }

    getUserGroupIds(uid) {
        return this.db.object('users/' + uid + '/groups');
    }

    getGroupUsers(gid) {
        const users$ = new ReplaySubject();
        this.db.list('groups/' + gid + '/users').first().subscribe(uList => {
            const users = [];
            uList.forEach(user => {
                this.db.object('users/' + user.$key).subscribe(u => {
                    users.push(u);
                });
            });
            users$.next(users);
        });
        return users$;
    }

    removeUserFromGroup(gid, uid) {
        const users = this.db.list('/groups/' + gid + '/users');

        users.subscribe(u => {
            if (u.length === 1) {
                this.db.list('/groups').remove(gid);
            } else {
                users.remove(uid);
            }
        });

    }

    getGroup(gid) {
        return this.db.object('groups/' + gid);
    }

    createGroup(g: Group): Observable<string> {
        g.users = {};
        g.users[this.config.userId] = 'creator';
        const items = this.db.list('/groups');
        return Observable.fromPromise(items.push(g)).map(
            v => {
                return v.path.pieces_[1];
            }
        )
    }

    saveGroup(group: Group) {
        const gid = group.$key;
        this.db.object('groups/' + gid).update(group);
    }

    userInGroup(uid, gid) {
        return this.db.list('users/' + uid + '/groups').map(gList => {
            let inGroup = false;
            gList.forEach(g => {
                if (g.$key === gid) {
                    inGroup = true;
                }
            });
            return inGroup;
        });
    }

    addUser(gid, uid, type) {
        const newUser = {};
        newUser[uid] = type;
        return this.db.object('groups/' + gid + '/users').update(newUser);
    }

}
