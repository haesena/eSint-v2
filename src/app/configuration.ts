import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Invite} from './models/invite';

export class Configuration {
    loading = false;
    userId: string;
    userId$ = new ReplaySubject();

    activeGroup: string;
    activeGroup$ = new ReplaySubject();

    invite: Invite;

    pageTitle: string;
}
