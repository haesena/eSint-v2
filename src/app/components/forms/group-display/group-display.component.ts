import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Configuration} from '../../../configuration';
import {Group} from '../../../models/group';
import {User} from '../../../models/user';
import {GroupsService} from '../../../services/firebase/groups.service';

@Component({
    selector: 'app-group-display',
    templateUrl: './group-display.component.html',
    styleUrls: ['./group-display.component.css']
})
export class GroupDisplayComponent implements OnInit {

    public userList = [];
    @Input() group: Group = null;
    @Output() leaveEvent: EventEmitter<any> = new EventEmitter();
    @Output() inviteEvent: EventEmitter<any> = new EventEmitter();

    constructor(public config: Configuration, public groupService: GroupsService) {
    }

    ngOnInit() {
        if (this.group == null) {
            this.group = new Group();
        } else {
            console.log(this.group);
            this.groupService.getGroupUsers(this.group.$key).subscribe((uList: User[]) => {
                this.userList = uList;
            });
        }
    }

    leaveGroup() {
        this.leaveEvent.emit(this.group);
    }

    inviteGroup() {
        this.inviteEvent.emit(this.group);
    }
}
