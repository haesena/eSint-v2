import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../services/firebase/user.service';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/authentication/auth.service';
import {Configuration} from '../../../configuration';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

    constructor(public userS: UserService, private router: Router, public auth: AuthService, private config: Configuration) {
    }

    ngOnInit() {
    }


    logOut() {
        this.auth.logOut();
        this.router.navigate(['/login']);
        this.config.userId = null;
        this.config.userId$.next(null);
    }

}
