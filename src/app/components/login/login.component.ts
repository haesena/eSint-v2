import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {Router} from '@angular/router';
import {Configuration} from '../../configuration';
import {AuthService} from '../../services/authentication/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    constructor(private router: Router, private auth: AuthService) {
    }

    ngOnInit() {
    }

    googleLogin() {
        this.auth.logInWithProvider('google').then(
            result => this.router.navigate(['start'])
        );
    }

    facebookLogin() {
        this.auth.logInWithProvider('facebook').then(
            result => this.router.navigate(['start'])
        );
    }
}
