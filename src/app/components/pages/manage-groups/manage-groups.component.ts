import {Component, OnInit} from '@angular/core';
import {GroupsService} from '../../../services/firebase/groups.service';

@Component({
    selector: 'app-manage-groups',
    templateUrl: './manage-groups.component.html',
    styleUrls: ['./manage-groups.component.css']
})
export class ManageGroupsComponent implements OnInit {

    public groups$;

    constructor(private groupsService: GroupsService) {
    }

    ngOnInit() {
        this.groups$ = this.groupsService.getGroups();
    }

}
