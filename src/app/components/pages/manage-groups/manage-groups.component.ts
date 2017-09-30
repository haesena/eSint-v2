import {Component, OnInit} from '@angular/core';
import {GroupsService} from '../../../services/firebase/groups.service';
import 'rxjs/add/operator/first';
import {forEach} from '@angular/router/src/utils/collection';
import {UserService} from '../../../services/firebase/user.service';
import {Configuration} from '../../../configuration';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {AuthService} from '../../../services/authentication/auth.service';

@Component({
    selector: 'app-manage-groups',
    templateUrl: './manage-groups.component.html',
    styleUrls: ['./manage-groups.component.css']
})
export class ManageGroupsComponent implements OnInit {
    public groups;

    constructor(public groupsService: GroupsService, public userService: UserService,
                public config: Configuration, private auth: AuthService) {
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

}
