import {Injectable} from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import {User} from '../../models/user';

@Injectable()
export class UserService {

    constructor(public db: AngularFireDatabase) {
    }

    getUser(uid: string) {
        return this.db.object('users/' + uid);
    }

    setUser(uid: string, user: User) {
        return this.db.object('users/' + uid).update(user);
    }

}
