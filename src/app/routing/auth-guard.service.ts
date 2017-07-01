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


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private auth: AngularFireAuth, private config: Configuration) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.auth.authState.map(auth => {
            if (auth == null) {
                this.config.setLoggedIn(false);
                this.router.navigate(['/login']);
                return false;
            } else {
                this.config.setLoggedIn(true);
                return true;
            }
        });
    }
}
