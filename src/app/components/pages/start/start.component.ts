import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../services/firebase/user.service';
import {GroupsService} from '../../../services/firebase/groups.service';
import {Group} from '../../../models/group';

@Component({
    selector: 'app-start',
    templateUrl: './start.component.html',
    styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {
    public activeGroup: Group;

    constructor(public userService: UserService, private gServce: GroupsService) {
    }

    ngOnInit() {
        this.userService.user$.subscribe(u => {
            this.gServce.getGroup(u.activeGroup).subscribe(g => {
                this.activeGroup = g;
            });
        });
    }
}
