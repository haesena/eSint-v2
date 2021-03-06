import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../services/firebase/user.service';
import {GroupsService} from '../../../services/firebase/groups.service';
import {User} from '../../../models/user';
import {Configuration} from '../../../configuration';
import {WishlistsService} from '../../../services/firebase/wishlists.service';
import {isNullOrUndefined} from "util";

@Component({
    selector: 'app-list-select',
    templateUrl: './list-select.component.html',
    styleUrls: ['./list-select.component.css']
})
export class ListSelectComponent implements OnInit {

    public photoUrl: string;
    public myList;
    public wishlists = [];

    constructor(private uService: UserService, private wService: WishlistsService, private config: Configuration) {
    }

    ngOnInit() {
        this.config.activeGroup$.subscribe(ag => {
            if (!isNullOrUndefined(ag)) {
                this.wService.getWishlistId(ag, this.config.userId).subscribe(id => {
                    this.wService.getWishlistOfGroup(ag).subscribe((wLists: any) => {
                        this.myList = wLists.find(l => l.$key === id);
                        this.wishlists = wLists.filter(l => l.$key !== id);
                    });
                });
            } else {
                this.myList = null;
                this.wishlists = [];
            }
        });
    }

}
