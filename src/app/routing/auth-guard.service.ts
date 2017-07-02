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

    constructor(private router: Router, private auth: AuthService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.auth.authState().map(auth => {
                if (auth == null) {
                    this.auth.setLoggedIn(auth);
                    this.router.navigate(['/login']);
                    return false;
                } else {
                    this.auth.setLoggedIn(auth);
                    return true;
                }
            });
    }
}
