import {Component, OnInit} from '@angular/core';
import {Group} from '../../../models/group';
import {GroupsService} from '../../../services/firebase/groups.service';
import {UserService} from '../../../services/firebase/user.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-new-group',
    templateUrl: './new-group.component.html',
    styleUrls: ['./new-group.component.css']
})
export class NewGroupComponent implements OnInit {

    constructor(public groupsService: GroupsService, private userService: UserService, private router: Router) {
    }

    ngOnInit() {
    }

    createGroup(g: Group) {
        this.groupsService.createGroup(g).subscribe(
            v => {
                this.userService.addGroup(v, 'creator');
                this.userService.setActiveGroup(v);
                this.router.navigate(['/start']);
            }
        );
    }

}
