import {Component, OnInit} from '@angular/core';
import {WishlistsService} from '../../../services/firebase/wishlists.service';
import {Configuration} from '../../../configuration';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Wish} from '../../../models/wish';

@Component({
    selector: 'app-wishlist',
    templateUrl: './wishlist.component.html',
    styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

    wishes: Wish[];
    wListName: string;

    constructor(public wService: WishlistsService, public config: Configuration, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe((p: ParamMap) => {
            // p.get('lid')
            console.log('uid: ' + p.get('lid'));
            this.wService.getWishlist(p.get('lid')).subscribe(wList => {
                this.wListName = wList.name;
            });

            this.wService.getWishes(p.get('lid')).subscribe(wishes => {
                this.wishes = wishes;
            });
        });
    }

}
