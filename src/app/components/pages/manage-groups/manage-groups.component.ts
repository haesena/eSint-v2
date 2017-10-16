import {Component, OnInit} from '@angular/core';
import {GroupsService} from '../../../services/firebase/groups.service';
import 'rxjs/add/operator/first';
import {UserService} from '../../../services/firebase/user.service';
import {Configuration} from '../../../configuration';
import {InvitesService} from '../../../services/firebase/invites.service';
import {MatDialog} from '@angular/material';
import {InviteDialogComponent} from '../../partials/invite-dialog/invite-dialog.component';
import {Group} from '../../../models/group';
import {ConfirmDialogComponent} from '../../partials/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-manage-groups',
    templateUrl: './manage-groups.component.html',
    styleUrls: ['./manage-groups.component.css']
})
export class ManageGroupsComponent implements OnInit {
    public groups;

    constructor(public groupsService: GroupsService, public userService: UserService, private inviteService: InvitesService,
                public config: Configuration, public dialog: MatDialog) {
    }

    ngOnInit() {
        this.groupsService.getUserGroups(this.config.userId).subscribe(g => {
            this.groups = g;
        });
    }

    leaveGroup(group: Group) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {confirmMessage: 'Are you sure you want to leave this group?'}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === true) {
                this.groupsService.removeUserFromGroup(group.$key, this.config.userId);
                this.userService.removeGroupFromUser(this.config.userId, group.$key);
            }
        });
    }

    inviteGroup(group: Group) {
        this.inviteService.getInviteForGroup(group.$key, this.userService.user.displayName, group.name).subscribe(i => {
            const dialogRef = this.dialog.open(InviteDialogComponent, {
                data: {invite: i}
            });
        });
    }
}
