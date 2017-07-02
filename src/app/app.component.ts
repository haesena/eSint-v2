import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {MdSidenav} from '@angular/material';
import {Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import {Configuration} from './configuration';
import {AuthService} from './services/authentication/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    sidenav_mode = 'side';
    @ViewChild('sidenav') private sidenav: MdSidenav;

    constructor(private _ngZone: NgZone, public auth: AuthService, public config: Configuration, private router: Router) {
    }

    ngOnInit() {

        this.auth.loggedIn$.subscribe(value => {
            if (value === true) {
                this.checkMenu();
            } else {
                this.sidenav.close();
            }
        })

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

    logOut() {
        this.auth.logOut();
        this.router.navigate(['/login']);
    }
}
