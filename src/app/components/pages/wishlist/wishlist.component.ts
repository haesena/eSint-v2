import {Component, OnInit} from '@angular/core';
import {WishlistsService} from '../../../services/firebase/wishlists.service';
import {Configuration} from '../../../configuration';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Wish} from '../../../models/wish';
import {GiftsService} from '../../../services/firebase/gifts.service';

@Component({
    selector: 'app-wishlist',
    templateUrl: './wishlist.component.html',
    styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

    wishes;
    myGifts = [];
    wListName: string;
    private lid: string;

    constructor(public wService: WishlistsService, public config: Configuration, private route: ActivatedRoute, private gService: GiftsService) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe((p: ParamMap) => {
            this.lid = p.get('lid');
            this.wService.getWishlist(this.lid).subscribe(wList => {
                this.wListName = wList.name;
            });

            this.wService.getWishesWithAdditionalInfos(this.lid).subscribe(wishes => {
                this.wishes = wishes;
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

}
