import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {GroupsService} from '../../../services/firebase/groups.service';
import {UserService} from '../../../services/firebase/user.service';
import {Observable} from "rxjs/Rx";
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Group} from '../../../models/group';

@Component({
    selector: 'app-group-select',
    templateUrl: './group-select.component.html',
    styleUrls: ['./group-select.component.css']
})
export class GroupSelectComponent implements OnInit {
    public groups$: ReplaySubject<Group[]>;
    public activeGroupName: string;
    public showGroups: boolean;
    @Output() linkClicked: EventEmitter<any> = new EventEmitter();

    constructor(public groupsService: GroupsService, public userService: UserService) {
        this.groups$ = new ReplaySubject();
    }

    ngOnInit() {
        this.groups$ = this.groupsService.getGroups();
        this.userService.getActiveGroupName().subscribe(a => {
            this.activeGroupName = a.$value;
        });
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
