import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDrawer} from '@angular/material';
import {AuthService} from './services/authentication/auth.service';
import {UserService} from './services/firebase/user.service';
import {Configuration} from './configuration';
import {ConfirmDialogComponent} from './components/partials/confirm-dialog/confirm-dialog.component';
import {NotificationsService} from './services/firebase/notifications.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    sidenav_mode = 'side';
    @ViewChild('sidenav') private sidenav: MatDrawer;
    public photoUrl: string;
    public notificationCount = 0;

    constructor(private _ngZone: NgZone, public auth: AuthService, public uService: UserService, public config: Configuration,
                public dialog: MatDialog, public nService: NotificationsService) {
    }

    ngOnInit() {

        this.auth.loggedIn$.subscribe(value => {
            if (value === true) {
                this.checkMenu();
                this.checkNotification();

                this.uService.user$.subscribe(u => {
                    if (u.photoUrl) {
                        this.photoUrl = u.photoUrl;
                    } else {
                        this.photoUrl = '../../assets/images/user-default.png';
                    }
                    this.notificationCount = u.notificationCount;
                });
            } else {
                this.sidenav.close();
            }
        });

        window.onresize = (e) => {
            this.checkMenu();
        };
        this.checkMenu();
    }

    collapse() {
        if (this.sidenav_mode === 'over') {
            this.sidenav.close();
        }
    }

    checkMenu() {
        this._ngZone.run(() => {
            const w = window.innerWidth;
            if (w > 768 && this.auth.loggedIn) {
                this.sidenav.open();
                this.sidenav_mode = 'side';
            } else {
                this.sidenav.close();
                this.sidenav_mode = 'over';
            }
        });
    }

    checkNotification() {
        const askedForNotificationPermission = localStorage.getItem('askedForNotificationPermission');
        if (askedForNotificationPermission === 'yes') {
            return true;
        }

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {confirmMessage: 'Do you want to turn on push notifications for eSint? ' +
            'You can always change this on the settings-page (click on your avatar in the top right corner).'}
        });

        localStorage.setItem('askedForNotificationPermission', 'yes');

        dialogRef.afterClosed().subscribe(result => {
            if (result === true) {
                this.nService.activatePushNotifications();
            }
        });
    }
}
