import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Configuration} from '../../../configuration';
import {AuthService} from '../../../services/authentication/auth.service';
import {GroupsService} from '../../../services/firebase/groups.service';
import {UserService} from '../../../services/firebase/user.service';
import {WishlistsService} from '../../../services/firebase/wishlists.service';
import {MatDialog} from '@angular/material';
import {ConfirmDialogComponent} from '../../partials/confirm-dialog/confirm-dialog.component';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'app-invite',
    templateUrl: './invite.component.html',
    styleUrls: ['./invite.component.css']
})
export class InviteComponent implements OnInit {

    public loggedIn = false;
    public noNeedForInvite = false;
    public msg = 'loading invite...';

    constructor(public config: Configuration, private router: Router, private auth: AuthService, public dialog: MatDialog,
                private gService: GroupsService, private uService: UserService, private wService: WishlistsService) {
    }

    ngOnInit() {
        if (this.config.invite == null) {
            this.msg = 'Invalid invite';
        } else {
            this.auth.authState().subscribe(auth => {
                this.auth.setLoggedIn(auth);
                if (auth !== null) {
                    this.loggedIn = true;
                    this.checkIfInviteNeeded(auth.uid);
                }
            });
        }
    }

    checkIfInviteNeeded(uid) {
        // check if user the user is already in the group
        this.gService.getUserGroupIds(uid).subscribe(groups => {
            const inGroup = groups[this.config.invite.group] != null;
            console.log('inGroup', inGroup);
            // if this is a group invite, this ties directly to the need to show the invite
            if (this.config.invite.type === 'group') {
                this.noNeedForInvite = inGroup;
            } else if (this.config.invite.type === 'list') {
                if (inGroup) {
                    this.wService.getWishlistId(this.config.invite.group, uid).subscribe(id => {
                        this.noNeedForInvite = (id === this.config.invite.list);
                    });
                }
            } else {
                this.config.invite = null;
                this.msg = 'Invalid invite';
            }
        });
    }

    joinGroup() {
        this.addUserToGroup(this.config.userId, this.config.invite.group)
            .then(() => this.router.navigate(['/start']));
    }

    joinList() {
        this.gService.getUserGroupIds(this.config.userId)
            .take(1)
            .map(groups => groups[this.config.invite.group] != null)
            .map(inGroup => {
                if (!inGroup) {
                    return this.addUserToGroup(this.config.userId, this.config.invite.group);
                } else {
                    return this.uService.setActiveGroup(this.config.invite.group).then(() => true);
                }
            })
            .map(() => this.wService.getWishes(this.config.userId).take(1))
            .switchMap(list => list)
            .switchMap(list => list.length > 0 ? this.decisionForMergingWishlists(list) : Observable.of(false))
            .subscribe(decision => {
                console.log('joining list');
                this.wService.joinWishlist(this.config.userId, this.config.invite.group, this.config.invite.list).then(() => {
                    if (decision) {
                        this.wService.mergeWishes(this.config.userId, this.config.invite.group, this.config.invite.list);
                        console.log('merging wishes');
                    }
                });
            });
    }

    decisionForMergingWishlists(wishes) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                confirmMessage: [
                    'You already have some wishes in your current wishlist:',
                    wishes.map(w => w.name).join(', '),
                    'Do you want to merge these wishes in to the wishlist you are joining?'
                ]
            }
        });

        return dialogRef.afterClosed();
    }

    addUserToGroup(uid, gid) {
        return this.uService.addGroup(gid, 'invite')
            .then(() => this.gService.addUser(gid, uid, 'invite'))
            .then(() => this.uService.setActiveGroup(gid));
    }
}
