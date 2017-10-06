import {Component, OnInit, ViewChild} from '@angular/core';
import {WishlistsService} from '../../../services/firebase/wishlists.service';
import {Configuration} from '../../../configuration';
import {Wish} from '../../../models/wish';
import {UserService} from '../../../services/firebase/user.service';
import {MdInput} from '@angular/material';

@Component({
    selector: 'app-my-list',
    templateUrl: './my-list.component.html',
    styleUrls: ['./my-list.component.css']
})
export class MyListComponent implements OnInit {
    noWishes = false;
    editName = false;
    wishes: Wish[];
    wishlist$;
    constructor(public wService: WishlistsService, public config: Configuration, private uService: UserService) {
    }

    ngOnInit() {
        this.wishlist$ = this.wService.getWishlist(this.config.userId);
        this.wishlist$.subscribe(n => {
            if (n.name == null) {
                this.wishlist$.update({name: this.uService.user.displayName + '\'s wishlist'});
            } else {
                console.log(n);
            }
        });

        this.wService.getWishes(this.config.userId).subscribe(wishes => {
            this.noWishes = (wishes.length === 0);
            this.wishes = wishes;
        });
    }

    deleteWish(wish: Wish) {
        this.wService.deleteWish(wish.$key)
    }
}
