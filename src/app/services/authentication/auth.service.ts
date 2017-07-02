import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {

    public loggedIn = false;
    loggedIn$ = new BehaviorSubject<boolean>(false);

    constructor(public auth: AngularFireAuth) {
    }

    setLoggedIn(user: firebase.User | null) {
        if (user == null) {
            this.loggedIn = false;
        } else {
            console.log(user.uid);
            console.log(user.displayName);
            console.log(user.photoURL);
            this.loggedIn = true;
        }
        this.loggedIn$.next(this.loggedIn);
    };

    logOut() {
        this.setLoggedIn(null);
        this.auth.auth.signOut();
    };

    authState() {
        return this.auth.authState;
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
                this.setLoggedIn(null);
            }
        );
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
}
