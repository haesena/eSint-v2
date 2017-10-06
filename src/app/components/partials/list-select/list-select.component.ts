import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../services/firebase/user.service';
import {GroupsService} from '../../../services/firebase/groups.service';
import {User} from '../../../models/user';
import {Configuration} from '../../../configuration';
import {WishlistsService} from '../../../services/firebase/wishlists.service';

@Component({
    selector: 'app-list-select',
    templateUrl: './list-select.component.html',
    styleUrls: ['./list-select.component.css']
})
export class ListSelectComponent implements OnInit {

    public photoUrl: string;
    public wishlists = [];

    constructor(private uService: UserService, private wService: WishlistsService, private config: Configuration) {
    }

    ngOnInit() {
        this.uService.user$.subscribe(u => {
            if (u.photoUrl) {
                this.photoUrl = u.photoUrl;
            } else {
                this.photoUrl = '../../assets/images/user-default.png';
            }
        });

        this.wService.getWishlistOfActiveGroup().subscribe((wLists: any) => {
            this.wishlists = wLists;
        })
    }

}
