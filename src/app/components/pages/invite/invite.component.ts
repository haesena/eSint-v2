import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {InvitesService} from '../../../services/firebase/invites.service';
import {Invite} from '../../../models/invite';
import {Configuration} from '../../../configuration';
import {AuthService} from '../../../services/authentication/auth.service';
import {GroupsService} from '../../../services/firebase/groups.service';
import {Observable} from 'rxjs/Observable';
import {UserService} from '../../../services/firebase/user.service';

@Component({
    selector: 'app-invite',
    templateUrl: './invite.component.html',
    styleUrls: ['./invite.component.css']
})
export class InviteComponent implements OnInit {

    public invite: Invite;
    public loggedIn = false;
    public alreadyInGroup = false;
    public msg = 'loading invite...';

    constructor(private route: ActivatedRoute, public inviteService: InvitesService, public config: Configuration,
                private router: Router, private auth: AuthService, private gService: GroupsService, private uService: UserService) {
    }

    ngOnInit() {
        this.config.loading = true;
        this.route.paramMap.subscribe((p: ParamMap) => {
            this.inviteService.getInvite(p.get('inviteId')).subscribe(i => {
                this.config.loading = false;

                if (i.$value === null) {
                    this.invite = null;
                    this.msg = 'Invalid invite';
                } else {
                    this.invite = i;
                }
            });
        });

        this.auth.authState().subscribe(auth => {
            this.auth.setLoggedIn(auth);
            if (auth !== null) {
                this.loggedIn = true;

                // this.gService.userInGroup(auth.uid, this.invite.group).subscribe(inGroup => {
                //     this.alreadyInGroup = inGroup;
                // });
            }
        });
    }

    logIn() {
        this.config.invite = this.invite.$key;
        this.router.navigate(['login']);
    }

    join() {
        console.log('joining group ' + this.invite.group);
        this.uService.addGroup(this.invite.group, 'invite').then(v => {
            console.log('group added to user');
            this.gService.addUser(this.invite.group, this.config.userId, 'invite');
            // this.uService.setActiveGroup(this.invite.group);
            // this.router.navigate(['/start']);
        });
    }
}
