import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {InvitesService} from '../../../services/firebase/invites.service';
import {Invite} from '../../../models/invite';
import {Configuration} from '../../../configuration';
import {AuthService} from '../../../services/authentication/auth.service';
import {GroupsService} from '../../../services/firebase/groups.service';
import {Observable} from 'rxjs/Observable';
import {UserService} from '../../../services/firebase/user.service';
import {Group} from '../../../models/group';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ReplaySubject} from 'rxjs/ReplaySubject';

@Component({
    selector: 'app-invite',
    templateUrl: './invite.component.html',
    styleUrls: ['./invite.component.css']
})
export class InviteComponent implements OnInit {

    public loggedIn = false;
    public alreadyInGroup = false;
    public msg = 'loading invite...';

    constructor(public config: Configuration, private router: Router, private auth: AuthService,
                private gService: GroupsService, private uService: UserService) {
    }

    ngOnInit() {
        if (this.config.invite == null) {
            this.msg = 'Invalid invite';
        } else {
            this.auth.authState().subscribe(auth => {
                this.auth.setLoggedIn(auth);
                if (auth !== null) {
                    this.loggedIn = true;
                    this.gService.getUserGroupIds(auth.uid).subscribe(groups => {
                        this.alreadyInGroup = groups[this.config.invite.group] != null;
                    });
                }
            });
        }
    }

    join() {
        this.uService.addGroup(this.config.invite.group, 'invite').then(v => {
            this.gService.addUser(this.config.invite.group, this.config.userId, 'invite').then(ok => {
                this.uService.setActiveGroup(this.config.invite.group);
                this.router.navigate(['/start']);
            });
        });
    }
}
