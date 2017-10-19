import {Component, OnInit, ViewChild} from '@angular/core';
import {WishlistsService} from '../../../services/firebase/wishlists.service';
import {Configuration} from '../../../configuration';
import {Wish} from '../../../models/wish';
import {UserService} from '../../../services/firebase/user.service';
import {MatDialog, MatInput} from '@angular/material';
import {ConfirmDialogComponent} from '../../partials/confirm-dialog/confirm-dialog.component';
import {InvitesService} from '../../../services/firebase/invites.service';
import {InviteDialogComponent} from '../../partials/invite-dialog/invite-dialog.component';
import {GroupsService} from '../../../services/firebase/groups.service';

@Component({
    selector: 'app-my-list',
    templateUrl: './my-list.component.html',
    styleUrls: ['./my-list.component.css']
})
export class MyListComponent implements OnInit {
    editName = false;
    public wishes = [];
    public listName: string = null;
    public sharedUsers;
    public rightfulOwner = false;

    constructor(public wService: WishlistsService, public config: Configuration, private uService: UserService,
                public dialog: MatDialog, private iService: InvitesService, private gService: GroupsService) {
    }

    ngOnInit() {
        this.wService.getWishlist(this.config.userId).subscribe(w => {
            this.sharedUsers = w.users;
            this.rightfulOwner = w.$key === this.config.userId;
        });

        this.syncName();
        this.wService.getWishes(this.config.userId).subscribe(wishes => {
            this.wishes = wishes;
        });
    }

    deleteWish(wish: Wish) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                confirmMessage: [
                    'Are you sure you want to delete this wish?',
                    'Another user may already have marked this wish as taken. He may even already have bought the gift!'
                ]
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === true) {
                this.wService.deleteWish(wish.$key)
            }
        });
    }

    syncName() {
        this.wService.getWishlist(this.config.userId).take(1).subscribe(n => {
            if (n.name == null) {
                this.updateName(this.uService.user.displayName + '\'s wishlist');
            }
            this.listName = n.name;
        });
    }

    updateName(newName) {
        this.wService.updateWishlist({name: newName});
        this.editName = false;
    }

    cancelEditName() {
        this.editName = false;
        this.syncName();
    }

    inviteUserToList() {
        this.wService.getWishlist(this.config.userId).take(1).subscribe(l => {
            this.gService.getGroup(this.config.activeGroup).take(1).subscribe(g => {
                this.iService.getInviteForList(l.$key, this.uService.user.displayName, this.listName, this.config.activeGroup, g.name)
                    .subscribe(i => {
                        const dialogRef = this.dialog.open(InviteDialogComponent, {
                            data: {invite: i, type: 'wishlist'}
                        });
                    });
            });
        })
    }

    removeUserFromList(uid) {
        this.wService.removeUserFromSharedList(uid);
    }
}
