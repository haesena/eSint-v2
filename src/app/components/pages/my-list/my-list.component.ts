import {Component, OnInit, ViewChild} from '@angular/core';
import {WishlistsService} from '../../../services/firebase/wishlists.service';
import {Configuration} from '../../../configuration';
import {Wish} from '../../../models/wish';
import {UserService} from '../../../services/firebase/user.service';
import {MatDialog, MatInput} from '@angular/material';
import {ConfirmDialogComponent} from '../../partials/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-my-list',
    templateUrl: './my-list.component.html',
    styleUrls: ['./my-list.component.css']
})
export class MyListComponent implements OnInit {
    editName = false;
    wishes;
    wishlist$;
    constructor(public wService: WishlistsService, public config: Configuration, private uService: UserService,
                public dialog: MatDialog) {
    }

    ngOnInit() {
        this.wishlist$ = this.wService.getWishlist(this.config.userId);
        this.wishlist$.subscribe(n => {
            if (n.name == null) {
                this.wishlist$.update({name: this.uService.user.displayName + '\'s wishlist'});
            }
        });

        this.wService.getWishes(this.config.userId).subscribe(wishes => {
            this.wishes = wishes;
        });
    }

    deleteWish(wish: Wish) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {confirmMessage: 'Are you sure you want to delete this wish? Another user may already have marked this ' +
            'wish as taken. He mal even already have bought the gift!'}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === true) {
                this.wService.deleteWish(wish.$key)
            }
        });
    }

    restoreWish(wish: Wish) {
        this.wService.restoreWish(wish.$key)
    }
}
