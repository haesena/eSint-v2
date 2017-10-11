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

    refreshLogin() {
        // this.auth
    }

    tryLogin(type) {
        console.log('trying login type: ' + type);
        if (type === 'email') {
            const mail = localStorage.get('esintLoginMail');
            const pwd = localStorage.get('esintLoginMail');
            return Observable.fromPromise(this.logInEmail(mail, pwd)).map(r => {
                    return true;
                },
                e => {
                    return false;
                });
        } else {
            return Observable.fromPromise(this.logInWithProvider(type)).map(r => {
                console.log('2 got result');
                return true;
            },
            e => {
                console.log('2 got error');
                return false;
            });
        }
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
        localStorage.setItem('esintAuth', null);
        this.setLoggedIn(null);
        this.auth.auth.signOut();
    };

    authState() {
        return this.auth.idToken;
    };

    logInWithProvider(type: string): firebase.Promise<any> {
        let provider = null;
        if (type === 'google') {
            localStorage.setItem('esintAuth', 'google');
            provider = new firebase.auth.GoogleAuthProvider();
        } else if (type === 'facebook') {
            localStorage.setItem('esintAuth', 'facebook');
            provider = new firebase.auth.FacebookAuthProvider()
        }

        return this.auth.auth.signInWithPopup(provider).then(
            result => {
                console.log(result);
                this.setLoggedIn(result.user);
            },
            error => {
                this.setLoggedIn(null);
            }
        );
    };

    logInEmail(email: string, password: string) {
        localStorage.setItem('esintAuth', 'email');
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
