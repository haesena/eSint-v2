import {Component, OnInit} from '@angular/core';
import {WishlistsService} from '../../../services/firebase/wishlists.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Wish} from '../../../models/wish';
import {Configuration} from '../../../configuration';

@Component({
    selector: 'app-edit-wish',
    templateUrl: './edit-wish.component.html',
    styleUrls: ['./edit-wish.component.css']
})
export class EditWishComponent implements OnInit {

    public wish;

    constructor(private wService: WishlistsService, private route: ActivatedRoute, private router: Router, private config: Configuration) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(
            (p: ParamMap) => {
                if (p.get('wid') === 'new') {
                    this.wish = new Wish();
                    this.config.pageTitle = 'New Wish';
                } else {
                    this.wService.getWish(p.get('wid')).subscribe(w => {
                        this.wish = w;
                    });
                    this.config.pageTitle = 'Edit Wish';
                }
            }
        )
    }

    saveWish(wish) {
        this.wService.saveWish(wish);
        this.router.navigate(['my-list']);
    }
}
