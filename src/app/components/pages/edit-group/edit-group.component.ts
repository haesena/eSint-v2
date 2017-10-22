import {Component, OnInit} from '@angular/core';
import {Group} from '../../../models/group';
import {GroupsService} from '../../../services/firebase/groups.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {UserService} from "app/services/firebase/user.service";
import {Configuration} from '../../../configuration';
import {WishlistsService} from '../../../services/firebase/wishlists.service';

@Component({
    selector: 'app-edit-group',
    templateUrl: './edit-group.component.html',
    styleUrls: ['./edit-group.component.css']
})
export class EditGroupComponent implements OnInit {
    public group: Group;
    private newForm: boolean;
    constructor(private gService: GroupsService, private route: ActivatedRoute, private router: Router,
                private uService: UserService, private wService: WishlistsService, private config: Configuration) {
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
                    this.gService.getGroup(p.get('gid')).subscribe(g => {
                            this.group = g;
                    });
                    this.config.pageTitle = 'Edit Group';
                }
            }
        )
    }

    saveGroup(g) {
        if (this.newForm) {
            this.gService.createGroup(g).subscribe(v => {
                this.uService.addGroup(v, 'creator')
                    .then(() => this.uService.setActiveGroup(v))
                    .then(() => this.wService.createWishlist(v, this.config.userId, this.uService.user.displayName + '\'s wishlist'))
                    .then(() => this.router.navigate(['/start']));
            });
        } else {
            this.gService.saveGroup(g);
            this.router.navigate(['manage-groups']);
        }
    }

}
