import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {MdSidenav} from '@angular/material';
import {AuthService} from './services/authentication/auth.service';
import {UserService} from './services/firebase/user.service';
import {Configuration} from './configuration';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    sidenav_mode = 'side';
    @ViewChild('sidenav') private sidenav: MdSidenav;
    public photoUrl: string;

    constructor(private _ngZone: NgZone, public auth: AuthService, public uService: UserService, public config: Configuration) {
    }

    ngOnInit() {

        this.auth.loggedIn$.subscribe(value => {
            if (value === true) {
                this.checkMenu();

                this.uService.user$.subscribe(u => {
                    if (u.photoUrl) {
                        this.photoUrl = u.photoUrl;
                    } else {
                        this.photoUrl = '../../assets/images/user-default.png';
                    }
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
}
