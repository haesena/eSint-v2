import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../services/firebase/user.service';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/authentication/auth.service';
import {Configuration} from '../../../configuration';
import {NotificationsService} from '../../../services/firebase/notifications.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

    public pushActivated;

    constructor(public userS: UserService, private router: Router, public auth: AuthService,
                public config: Configuration, public nService: NotificationsService) {
    }

    ngOnInit() {
        this.nService.pushActivated(this.config.userId).subscribe(v => {
            console.log(v);
            this.pushActivated = v;
        });
    }


    logOut() {
        this.auth.logOut();
        this.router.navigate(['/login']);
        this.config.userId = null;
        this.config.userId$.next(null);
    }

    setPushNotifications(value) {
        if (value) {
            this.nService.activatePushNotifications();
        }
    }

}
