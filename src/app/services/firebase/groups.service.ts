import 'rxjs/add/operator/map';
import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {Configuration} from '../../configuration';
import {UserService} from './user.service';
import {validate} from 'codelyzer/walkerFactory/walkerFn';
import {Group} from '../../models/group';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';

@Injectable()
export class GroupsService {

    constructor(public db: AngularFireDatabase, public config: Configuration, public userService: UserService) {
    }
    getGroups() {
        return this.db.list('/groups');
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
