import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {Router} from '@angular/router';
import {Configuration} from '../../configuration';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    user: Observable<firebase.User>;

    constructor(public auth: AngularFireAuth, private router: Router, private config: Configuration) {
        this.user = auth.authState;
    }

    ngOnInit() {
    }

    googleLogin() {
        this.auth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(
            result => {
                if (result.user == null) {
                    this.config.setLoggedIn(false);
                } else {
                    this.config.setLoggedIn(true);
                    this.router.navigate(['/start']);
                }
            },
            error => {
                this.config.setLoggedIn(false);
            }
        );
    }

    facebookLogin() {
        this.auth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(
            result => {
                if (result.user == null) {
                    this.config.setLoggedIn(false);
                } else {
                    this.config.setLoggedIn(true);
                    this.router.navigate(['/start']);
                }
            },
            error => {
                this.config.setLoggedIn(false);
            }
        );
    }
}
