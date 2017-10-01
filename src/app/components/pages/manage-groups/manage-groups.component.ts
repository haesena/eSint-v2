import {Component, OnInit} from '@angular/core';
import {GroupsService} from '../../../services/firebase/groups.service';
import 'rxjs/add/operator/first';
import {UserService} from '../../../services/firebase/user.service';
import {Configuration} from '../../../configuration';
import {InvitesService} from '../../../services/firebase/invites.service';
import {MdDialog} from '@angular/material';
import {InviteDialogComponent} from '../../partials/invite-dialog/invite-dialog.component';

@Component({
    selector: 'app-manage-groups',
    templateUrl: './manage-groups.component.html',
    styleUrls: ['./manage-groups.component.css']
})
export class ManageGroupsComponent implements OnInit {
    public groups;

    constructor(public groupsService: GroupsService, public userService: UserService, private inviteService: InvitesService,
                public config: Configuration, public dialog: MdDialog) {
    }

    ngOnInit() {
        this.groupsService.getUserGroups(this.config.userId).subscribe(g => {
            this.groups = g;
        });
    }

    leaveGroup(gid) {
        this.groupsService.removeUserFromGroup(gid, this.config.userId);
        this.userService.removeGroupFromUser(this.config.userId, gid);
    }

    inviteGroup(gid, gName) {
        this.userService.user$.subscribe(u => {
            this.inviteService.getInviteForGroup(gid, u.displayName, gName).subscribe(i => {
                console.log(i);
                const dialogRef = this.dialog.open(InviteDialogComponent, {
                    data: {invite: i}
                });
            });
        });
    }

}
