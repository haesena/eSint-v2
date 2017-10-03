import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {Configuration} from '../../configuration';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import {UserService} from './user.service';

@Injectable()
export class InvitesService {

    constructor(private db: AngularFireDatabase, private config: Configuration) {
    }

    getInvite(inviteId) {
        return this.db.object('invites/' + inviteId);
    }

    getInviteForGroup(gid, uName, gName) {
        const invites = this.db.list('invites');
        return invites.first().map(iList => {
            let invite = null;
            iList.forEach(i => {
                if (i.group === gid) {
                    invite = i.$key;
                }
            });

            if (invite !== null) {
                return invite;
            } else {

                const newInvite = {
                    user: this.config.userId,
                    userName: uName,
                    group: gid,
                    groupName: gName
                };

                return invites.push(newInvite).key;
            }
        });
    }

}
