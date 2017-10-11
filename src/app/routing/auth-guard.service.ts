import {Injectable} from '@angular/core';
import {
    CanActivate,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import {AngularFireAuth} from 'angularfire2/auth';
import {Observable} from 'rxjs/Observable';
import {Configuration} from '../configuration';
import {AuthService} from '../services/authentication/auth.service';


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private auth: AuthService, private config: Configuration) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.auth.authState().take(1).map(auth => {
            this.auth.setLoggedIn(auth);
            if (auth == null) {
                this.router.navigate(['/login']);
                return false;
            } else {
                return true;
            }
        });
    }
}
