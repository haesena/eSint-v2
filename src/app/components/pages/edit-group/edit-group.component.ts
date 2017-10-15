import {Component, OnInit} from '@angular/core';
import {Group} from '../../../models/group';
import {GroupsService} from '../../../services/firebase/groups.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {UserService} from "app/services/firebase/user.service";
import {Configuration} from '../../../configuration';

@Component({
    selector: 'app-edit-group',
    templateUrl: './edit-group.component.html',
    styleUrls: ['./edit-group.component.css']
})
export class EditGroupComponent implements OnInit {
    public group: Group;
    private newForm: boolean;
    constructor(private groupsService: GroupsService, private route: ActivatedRoute, private router: Router,
                private userService: UserService, private config: Configuration) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(
            (p: ParamMap) => {
                if (p.get('gid') === 'new') {
                   this.newForm = true;
                   this.group = new Group();
                    this.config.pageTitle = 'New Group';
                } else {
                    this.newForm = false;
                    this.groupsService.getGroup(p.get('gid')).subscribe(g => {
                            this.group = g;
                    });
                    this.config.pageTitle = 'Edit Group';
                }
            }
        )
    }

    saveGroup(g) {
        if (this.newForm) {
            this.groupsService.createGroup(g).subscribe(v => {
                this.userService.addGroup(v, 'creator');
                this.userService.setActiveGroup(v);
                this.router.navigate(['/start']);
            });
        } else {
            this.groupsService.saveGroup(g);
            this.router.navigate(['manage-groups']);
        }
    }

}
