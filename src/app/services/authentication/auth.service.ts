import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {User} from '../../models/user';
import {UserService} from '../firebase/user.service';
import {Configuration} from '../../configuration';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Router} from '@angular/router';

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
        localStorage.setItem('esintAuth', null);
        this.setLoggedIn(null);
        this.auth.auth.signOut();
    };

    authState() {
        return this.auth.authState;
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
