import {Injectable} from '@angular/core';
import {
    CanActivate,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import 'rxjs/add/operator/map';

import {AngularFireAuth} from 'angularfire2/auth';
import {Observable} from 'rxjs/Observable';
import {Configuration} from '../configuration';
import {AuthService} from '../services/authentication/auth.service';


@Injectable()
export class ActiveGroupGuard implements CanActivate {

    constructor(private config: Configuration) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.config.activeGroup$.map(g => {
            if (g == null) {
                return false;
            } else {
                return true;
            }
        });
    }
}
