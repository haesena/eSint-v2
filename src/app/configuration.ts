import {ReplaySubject} from 'rxjs/ReplaySubject';

export class Configuration {
    loading = false;
    userId: string;
    userId$ = new ReplaySubject();

    activeGroup: string;
    activeGroup$ = new ReplaySubject();

    invite: string;
}
