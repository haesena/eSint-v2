import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import {Configuration} from '../../../configuration';
import {AuthService} from '../../../services/authentication/auth.service';

@Component({
    selector: 'app-email',
    templateUrl: './email.component.html',
    styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {

    error: any;
    email: string;
    password: string;
    constructor(private auth: AuthService) {
        this.auth.authState().map(state => {
            if (state) {
                this.auth.setLoggedIn(state);
                this.auth.redirectAfterLogin();
            }
        });
    }

    ngOnInit() {
    }

    onSubmit(formData) {
        if (formData.valid) {
            this.auth.logInEmail(formData.value.email, formData.value.password)
                .then(
                    success => this.auth.redirectAfterLogin()
                )
                .catch(
                    err => this.error = err
                );
        }
    }
}
