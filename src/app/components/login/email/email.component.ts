import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import {Configuration} from '../../../configuration';

@Component({
    selector: 'app-email',
    templateUrl: './email.component.html',
    styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {

    error: any;
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
            this.af.auth.signInWithEmailAndPassword(
                formData.value.email,
                formData.value.password
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
