import {Injectable} from '@angular/core';
import {AngularFireOfflineDatabase} from 'angularfire2-offline';
import {Configuration} from '../../configuration';
import 'rxjs/add/observable/fromPromise';
import {AngularFireDatabase} from 'angularfire2/database';

@Injectable()
export class InvitesService {

    constructor(private db: AngularFireOfflineDatabase, private config: Configuration, private wdb: AngularFireDatabase) {
    }

    getInvite(inviteId) {
        return this.db.object('invites/' + inviteId);
    }

    getInviteForGroup(gid, uName, gName) {
        const invites = this.wdb.list('invites');
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
