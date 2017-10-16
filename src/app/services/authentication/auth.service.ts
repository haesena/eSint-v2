import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {User} from '../../models/user';
import {UserService} from '../firebase/user.service';
import {Configuration} from '../../configuration';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operator/map';

@Injectable()
export class AuthService {

    public loggedIn = false;
    loggedIn$ = new BehaviorSubject<boolean>(false);

    constructor(public auth: AngularFireAuth, public userService: UserService, private config: Configuration,
                private router: Router) {
    }

    setLoggedIn(user: firebase.User | null) {
        if (user == null) {
            this.loggedIn = false;
            this.config.userId = null;
            this.config.userId$.next(null);
        } else {
            this.config.userId$ = new ReplaySubject();

            this.config.userId = user.uid;
            this.config.userId$.next(user.uid);
            this.userService.setUser(user);
            this.loggedIn = true;
        }
        this.loggedIn$.next(this.loggedIn);
    };

    logOut() {
        this.setLoggedIn(null);
        this.auth.auth.signOut();
    };

    authState() {
        return this.auth.idToken;
    };

    logInWithProvider(type: string): firebase.Promise<any> {
        let provider = null;
        if (type === 'google') {
            provider = new firebase.auth.GoogleAuthProvider();
        } else if (type === 'facebook') {
            provider = new firebase.auth.FacebookAuthProvider()
        }

        return this.auth.auth.signInWithPopup(provider).then(
            result => {
                this.setLoggedIn(result.user);
            },
            error => {
                console.log('error while signing in with provieder ' + type, error);
                this.setLoggedIn(null);
                this.config.errorMessage = error.message ? error.message : '';
                this.router.navigate(['/start']);
            }
        ).catch(error => {
            console.log(' catched error', error);
            return error;
        });
    };

    logInEmail(email: string, password: string) {
        return this.auth.auth.signInWithEmailAndPassword(email, password)
            .then(
                user => this.setLoggedIn(user)
            );
    };

    logInSignup(email: string, password: string) {
        return this.auth.auth.createUserWithEmailAndPassword(email, password)
            .then(
                user => this.setLoggedIn(user)
            );
    };

    redirectAfterLogin() {
        if (this.config.invite == null) {
            this.router.navigate(['/start']);
        } else {
            this.router.navigate(['/invite/' + this.config.invite.$key]);
        }
    }
}
