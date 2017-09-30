import {Component, OnInit} from '@angular/core';
import {Group} from '../../../models/group';
import {GroupsService} from '../../../services/firebase/groups.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';

@Component({
    selector: 'app-edit-group',
    templateUrl: './edit-group.component.html',
    styleUrls: ['./edit-group.component.css']
})
export class EditGroupComponent implements OnInit {
    public group: Group;

    constructor(private groupsService: GroupsService, private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(
            (p: ParamMap) => {
                this.groupsService.getGroup(p.get('gid')).subscribe(
                    g => {
                        this.group = g;
                    }
                );
            }
        )
    }

    saveGroup(g) {
        this.groupsService.saveGroup(g);
        this.router.navigate(['manage-groups']);
    }

}
