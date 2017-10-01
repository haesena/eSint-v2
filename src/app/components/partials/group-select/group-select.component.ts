import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {GroupsService} from '../../../services/firebase/groups.service';
import {UserService} from '../../../services/firebase/user.service';
import {Router} from '@angular/router';
import {Configuration} from '../../../configuration';

@Component({
    selector: 'app-group-select',
    templateUrl: './group-select.component.html',
    styleUrls: ['./group-select.component.css']
})
export class GroupSelectComponent implements OnInit {
    public showGroups: boolean;
    public groups;
    @Output() linkClicked: EventEmitter<any> = new EventEmitter();

    constructor(public config: Configuration, public groupsService: GroupsService,
                public userService: UserService, private router: Router) {
    }

    ngOnInit() {
        this.config.userId$.subscribe(uid => {
            if (uid !== null) {
                this.groupsService.getUserGroups(uid).subscribe(g => {
                    this.groups = g
                });
            }
        });
    }

    toggleGroups() {
        this.showGroups = !this.showGroups;
    }

    clicked() {
        this.linkClicked.emit();
        this.showGroups = false;
    }

    chooseGroup(gid) {
        this.userService.setActiveGroup(gid);
        this.linkClicked.emit();
        this.showGroups = false;
        this.router.navigate(['/start']);
    }
}
