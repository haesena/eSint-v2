import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {GroupsService} from '../../../services/firebase/groups.service';
import {UserService} from '../../../services/firebase/user.service';

@Component({
    selector: 'app-group-select',
    templateUrl: './group-select.component.html',
    styleUrls: ['./group-select.component.css']
})
export class GroupSelectComponent implements OnInit {
    public groups$;
    public showGroups: boolean;
    @Output() linkClicked: EventEmitter<any> = new EventEmitter();

    constructor(public groupsService: GroupsService, public userService: UserService) {
    }

    ngOnInit() {
        this.groups$ = this.groupsService.getGroups();
        this.showGroups = false;
    }

    toggleGroups() {
        this.showGroups = !this.showGroups;
    }

    clicked() {
        this.linkClicked.emit();
    }

    chooseGroup(gid) {
        console.log(gid);
        this.userService.setActiveGroup(gid);
        this.linkClicked.emit();
        this.showGroups = false;
    }

}
