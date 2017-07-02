import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import {Configuration} from '../../../configuration';
import {AuthService} from '../../../services/authentication/auth.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

    error: any;
    email: string;
    password: string;

    constructor(private router: Router, private af: AngularFireAuth, private auth: AuthService) {
        this.auth.authState().map(state => {
            if (state) {
                this.auth.setLoggedIn(state);
                this.router.navigate(['start']);
            }
        });
    }

    ngOnInit() {
    }

    onSubmit(formData) {
        if (formData.valid) {
            this.auth.logInSignup(formData.value.email, formData.value.password)
                .then(
                    success => this.router.navigate(['/start'])
                )
                .catch(
                    err => this.error = err
                );
        }
    }

}
