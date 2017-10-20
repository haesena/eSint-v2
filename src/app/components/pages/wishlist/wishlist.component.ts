import {Component, OnInit} from '@angular/core';
import {WishlistsService} from '../../../services/firebase/wishlists.service';
import {Configuration} from '../../../configuration';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Wish} from '../../../models/wish';
import {GiftsService} from '../../../services/firebase/gifts.service';
import {NotificationsService} from '../../../services/firebase/notifications.service';
import {AngularFireDatabase} from 'angularfire2/database';
import {MatSnackBar} from '@angular/material';

@Component({
    selector: 'app-wishlist',
    templateUrl: './wishlist.component.html',
    styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

    public wishes = [];
    public myGifts = [];
    public wListName: string;
    public lid: string;
    public sharedUsers;

    constructor(private wService: WishlistsService, public config: Configuration, private route: ActivatedRoute,
                private gService: GiftsService, public nService: NotificationsService, private snackBar: MatSnackBar) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe((p: ParamMap) => {
            this.lid = p.get('lid');

            this.wService.getWishlist(this.lid).subscribe(wList => {
                console.log(wList.users);
                this.wListName = wList.name;
                this.sharedUsers = wList.users
            });

            this.wService.getWishesWithAdditionalInfos(this.lid).subscribe(wishes => {
                this.wishes = wishes;
                console.log(wishes);
            });

            this.gService.getMyGiftIds().subscribe(gids => {
                this.myGifts = gids.map(v => v.wish);
            });
        });
    }

    takeWish(wish) {
        this.wService.takeWish(this.config.activeGroup, this.lid, wish.$key);
    }

    untakeWish(wish) {
        this.wService.untakeWish(this.config.activeGroup, this.lid, wish.$key);
    }

    setSubscribed(value) {
        if (value.checked) {
            this.snackBar.open('You will receive notifications when a wish is added', 'OK', {duration: 3000});
        }
        this.nService.subscribeToWishlist(this.lid, value.checked);
    }

}
