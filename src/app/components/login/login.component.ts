import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/authentication/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    public loggingIn = false;

    constructor(private auth: AuthService) {
    }

    ngOnInit() {
    }

    googleLogin() {
        this.loggingIn = true;
        this.auth.logInWithProvider('google').then(
            result => this.auth.redirectAfterLogin()
        );
    }

    facebookLogin() {
        this.loggingIn = true;
        this.auth.logInWithProvider('facebook').then(
            result => this.auth.redirectAfterLogin()
        );
    }
}
