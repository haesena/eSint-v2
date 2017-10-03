import {Component, OnInit} from '@angular/core';
import {WishlistsService} from '../../../services/firebase/wishlists.service';
import {Configuration} from '../../../configuration';

@Component({
    selector: 'app-my-list',
    templateUrl: './my-list.component.html',
    styleUrls: ['./my-list.component.css']
})
export class MyListComponent implements OnInit {

    constructor(public wService: WishlistsService, private config: Configuration) {
    }

    ngOnInit() {
        this.wService.getWishes(this.config.userId).subscribe(wishes => {
            console.log(wishes);
        });
    }

    saveWish(wish) {
        this.wService.saveWish(wish);
    }
}
