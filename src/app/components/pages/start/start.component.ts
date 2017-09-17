import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../services/firebase/user.service';
import {GroupsService} from '../../../services/firebase/groups.service';

@Component({
    selector: 'app-start',
    templateUrl: './start.component.html',
    styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {
    public groups$;

    constructor(public userService: UserService, public groupsService: GroupsService) {
    }

    ngOnInit() {
        this.groups$ = this.groupsService.getGroups();
    }

}
