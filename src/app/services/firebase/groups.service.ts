import 'rxjs/add/operator/map';
import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {Configuration} from '../../configuration';
import {UserService} from './user.service';
import {validate} from 'codelyzer/walkerFactory/walkerFn';
import {Group} from '../../models/group';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {forEach} from '@angular/router/src/utils/collection';

@Injectable()
export class GroupsService {
    private groups$: ReplaySubject<Group[]>;

    constructor(public db: AngularFireDatabase, public config: Configuration, public userService: UserService) {
        this.groups$ = new ReplaySubject();
        this.db.list('/users/' + this.config.userId + '/groups').subscribe(
            userGroups => {
                const groups = [];
                userGroups.forEach(userGroup => {
                    this.db.object('/groups/' + userGroup.$key).subscribe(
                        g => groups.push(g)
                    );
                });
                this.groups$.next(groups);
            }
        );
    }

    getGroups() {
        return this.groups$;
    }

    getGroup(gid) {
        return this.db.object('groups/' + gid);
    }

    createGroup(g: Group): Observable<string> {
        // const uid = this.config.userId;
        g.users = {};
        g.users[this.config.userId] = 'creator';
        const items = this.db.list('/groups');
        return Observable.fromPromise(items.push(g)).map(
            v => {
                return v.path.pieces_[1];
            }
        )
    }

}
