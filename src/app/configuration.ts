import {BehaviorSubject} from 'rxjs/BehaviorSubject';
export class Configuration {
    loggedIn = false;
    loading = false;

    loggedInObs = new BehaviorSubject<boolean>(false);

    setLoggedIn(val) {
        this.loggedIn = val;
        this.loggedInObs.next(val);
    }
}
