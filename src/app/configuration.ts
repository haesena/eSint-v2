import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ReplaySubject} from 'rxjs/ReplaySubject';
export class Configuration {
    loading = false;
    userId: string;
    userId$ = new ReplaySubject();
}
