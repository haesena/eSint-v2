import {Injectable} from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import 'rxjs/add/operator/map';

import {Observable} from 'rxjs/Observable';
import {Configuration} from '../configuration';


@Injectable()
export class ActiveGroupGuard implements CanActivate {

    constructor(private config: Configuration) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.config.activeGroup$.map(g => {
            return g != null || this.config.activeGroup != null;
        });
    }
}
