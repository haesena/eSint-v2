import {Component, OnInit} from '@angular/core';
import {WishlistsService} from '../../../services/firebase/wishlists.service';
import {Configuration} from '../../../configuration';
import {Wish} from '../../../models/wish';

@Component({
    selector: 'app-my-list',
    templateUrl: './my-list.component.html',
    styleUrls: ['./my-list.component.css']
})
export class MyListComponent implements OnInit {

    showNewForm = false;
    noWishes = false;
    wishes: Wish[];

    constructor(public wService: WishlistsService, private config: Configuration) {
    }

    ngOnInit() {
        this.wService.getWishes(this.config.userId).subscribe(wishes => {
            this.noWishes = (wishes.length === 0);
            this.wishes = wishes;
        });
    }

    saveWish(wish) {
        this.wService.saveWish(wish);
        this.showNewForm = false;
    }
}
