import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Configuration} from '../../../configuration';
import {AuthService} from '../../../services/authentication/auth.service';
import {GroupsService} from '../../../services/firebase/groups.service';
import {UserService} from '../../../services/firebase/user.service';
import {WishlistsService} from '../../../services/firebase/wishlists.service';

@Component({
    selector: 'app-invite',
    templateUrl: './invite.component.html',
    styleUrls: ['./invite.component.css']
})
export class InviteComponent implements OnInit {

    public loggedIn = false;
    public noNeedForInvite = false;
    public msg = 'loading invite...';

    constructor(public config: Configuration, private router: Router, private auth: AuthService,
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
        if (this.config.invite.type === 'group') {
            this.gService.getUserGroupIds(uid).subscribe(groups => {
                this.noNeedForInvite = groups[this.config.invite.group] != null;
            });
        } else if (this.config.invite.type === 'list') {
            this.wService.getWishlistId(this.config.invite.group, uid).subscribe(id => {
                this.noNeedForInvite = (id === this.config.invite.list);
            });
        } else {
            this.config.invite = null;
            this.msg = 'Invalid invite';
        }
    }

    joinGroup() {
        this.uService.addGroup(this.config.invite.group, 'invite').then(() => {
            this.gService.addUser(this.config.invite.group, this.config.userId, 'invite').then(ok => {
                this.uService.setActiveGroup(this.config.invite.group);
                this.router.navigate(['/start']);
            });
        });
    }

    joinList() {
        // this.wService.getWishes(this.config.userId).take(1).subscribe(wList => {
        //     // if (wList.length > 0) {
        //     //
        //     // } else {
        //     //
        //     // }
        //     this.wService.joinWishlist(this.config.userId, this.config.invite.group, this.config.invite.list);
        // });
    }

    decisionForMergingWishlists() {

    }
}
