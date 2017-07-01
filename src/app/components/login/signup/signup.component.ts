import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import {Configuration} from '../../../configuration';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

    error: any;
    email: string;
    password: string;

    constructor(private router: Router, private af: AngularFireAuth, private config: Configuration) {
        this.af.authState.map(auth => {
            if (auth) {
                this.config.setLoggedIn(true);
                this.router.navigate(['start']);
            }
        });
    }

    ngOnInit() {
    }

    onSubmit(formData) {
        if (formData.valid) {
            this.af.auth.createUserWithEmailAndPassword(
                formData.value.email,
                formData.value.password,
            ).then(
                (success) => {
                    this.config.setLoggedIn(true);
                    this.router.navigate(['/start']);
                }
            ).catch(
                (err) => {
                    this.error = err;
                }
            );
        }
    }

}
