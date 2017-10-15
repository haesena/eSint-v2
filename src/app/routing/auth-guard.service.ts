import {Injectable} from '@angular/core';
import {
    CanActivate,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import {Observable} from 'rxjs/Observable';
import {AuthService} from '../services/authentication/auth.service';
import {NotificationsService} from '../services/firebase/notifications.service';
import {Configuration} from '../configuration';


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private auth: AuthService, private nService: NotificationsService, private config: Configuration) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        this.config.pageTitle = '';
        return this.auth.authState().take(1).map(auth => {
            this.auth.setLoggedIn(auth);
            if (auth == null) {
                this.router.navigate(['/login']);
                return false;
            } else {
                this.nService.listenForTokenRefresh();
                return true;
            }
        });
    }
}
