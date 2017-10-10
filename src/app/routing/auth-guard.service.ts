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
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private auth: AuthService, private config: Configuration) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.auth.authState().map(auth => {
            this.auth.setLoggedIn(auth);
            if (auth == null) {
                // const a = localStorage.getItem('esintAuth');
                // if (a !== null) {
                //     return this.auth.tryLogin(a);
                // } else {
                //     this.router.navigate(['/login']);
                //     return false;
                // }
                return false;
            } else {
                return true;
            }
        });
    }
}
