import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import 'rxjs/add/operator/map';

import {Observable} from 'rxjs/Observable';
import {Configuration} from '../configuration';
import {InvitesService} from '../services/firebase/invites.service';


@Injectable()
export class InviteGuard implements CanActivate {

    constructor(private config: Configuration, private inviteService: InvitesService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot, ): Observable<boolean> {
        return this.inviteService.getInvite(route.params.inviteId).map(i => {
            if (i.$value === null) {
                this.config.invite = null;
            } else {
                this.config.invite = i;
            }
            return true;
        });
    }
}
