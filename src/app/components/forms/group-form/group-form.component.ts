import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Group} from '../../../models/group';
import {GroupsService} from '../../../services/firebase/groups.service';
import {UserService} from '../../../services/firebase/user.service';
import {User} from '../../../models/user';
import {Location} from '@angular/common';

@Component({
    selector: 'app-group-form',
    templateUrl: './group-form.component.html',
    styleUrls: ['./group-form.component.css']
})
export class GroupFormComponent implements OnInit {
    @Input() group: Group = null;
    @Output() saveEvent: EventEmitter<any> = new EventEmitter();
    public readOnly: boolean;
    public userList = [];

    constructor(public groupService: GroupsService, public userService: UserService, private loc: Location) {
    }

    ngOnInit() {
        if (this.group == null) {
            this.group = new Group();
        }

        this.groupService.getGroupUsers(this.group.$key).subscribe((uList: User[]) => {
            this.userList = uList;
        });
        this.readOnly = this.saveEvent.observers.length === 0;
    }

    save() {
        this.saveEvent.emit(this.group);
    }

    cancel() {
        this.loc.back();
    }

}
