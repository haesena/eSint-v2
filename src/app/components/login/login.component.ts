import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/authentication/auth.service';
import {Configuration} from '../../configuration';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    public loggingIn = false;

    constructor(private auth: AuthService, public config: Configuration) {
    }

    ngOnInit() {
    }

    googleLogin() {
        this.loggingIn = true;
        this.auth.logInWithProvider('google')
            .then(
                result => this.auth.redirectAfterLogin(),
                error => {
                    this.loggingIn = false;
                })
            .catch(error => {
                this.loggingIn = false;
            });
    }

    facebookLogin() {
        this.loggingIn = true;
        this.auth.logInWithProvider('facebook')
            .then(
                result => this.auth.redirectAfterLogin(),
                error => {
                    this.loggingIn = false;
                })
            .catch(error => {
                this.loggingIn = false;
            });
    }

    close() {
        this.config.errorMessage = '';
        this.loggingIn = false;
    }
}
