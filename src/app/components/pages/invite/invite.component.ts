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

    public invite: Invite;
    private invite$ = new ReplaySubject();
    public loggedIn = false;
    public alreadyInGroup = false;
    public msg = 'loading invite...';

    constructor(private route: ActivatedRoute, public inviteService: InvitesService, public config: Configuration,
                private router: Router, private auth: AuthService, private gService: GroupsService, private uService: UserService,
                private cdref: ChangeDetectorRef) {
        // initialize the invite-subject
        this.invite$.next(false);
    }

    ngOnInit() {
        this.route.paramMap.subscribe((p: ParamMap) => {
            this.inviteService.getInvite(p.get('inviteId')).subscribe(i => {
                if (i.$value === null) {
                    this.invite = null;
                    this.msg = 'Invalid invite';
                } else {
                    this.invite = i;
                    this.invite$.next(true);
                }
            });
        });

        this.auth.authState().subscribe(auth => {
            this.auth.setLoggedIn(auth);
            if (auth !== null) {
                this.loggedIn = true;
                this.invite$.subscribe(v => {
                    if (v) {
                        this.gService.getUserGroupIds(auth.uid).subscribe(groups => {
                            this.alreadyInGroup = groups[this.invite.group] != null;
                        });
                    }
                });
            }
        });
    }

    logIn() {
        this.config.invite = this.invite.$key;
        this.router.navigate(['login']);
    }

    join() {
        this.uService.addGroup(this.invite.group, 'invite').then(v => {
            this.gService.addUser(this.invite.group, this.config.userId, 'invite').then(ok => {
                this.uService.setActiveGroup(this.invite.group);
                this.router.navigate(['/start']);
            });
        });
    }
}
