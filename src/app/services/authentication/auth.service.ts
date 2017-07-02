import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {User} from '../../models/user';
import {UserService} from '../firebase/user.service';

@Injectable()
export class AuthService {

    public loggedIn = false;
    loggedIn$ = new BehaviorSubject<boolean>(false);
    private user: User;

    constructor(public auth: AngularFireAuth, public userService: UserService) {
    }

    setLoggedIn(user: firebase.User | null) {
        if (user == null) {
            this.loggedIn = false;
        } else {
            this.user = new User();
            this.user.uid = user.uid;
            this.user.displayName = user.displayName;
            this.user.photoUrl = user.photoURL;

            this.userService.setUser(user.uid, this.user);

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
