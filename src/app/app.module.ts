import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
    MdSidenavModule,
    MdListModule,
    MdToolbarModule,
    MdIconModule,
    MdProgressBarModule,
    MdCardModule,
    MdButtonModule,
    MdInputModule
} from '@angular/material';

import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireAuthModule} from 'angularfire2/auth';

import {environment} from '../environments/environment';
import {AppComponent} from './app.component';
import {Configuration} from './configuration';

// Routing
import {AppRoutingModule} from './routing/app-routing.module';
import {AuthGuard} from './routing/auth-guard.service';
import {AuthService} from './services/authentication/auth.service';

// Components
import {LoginComponent} from './components/login/login.component';
import {StartComponent} from './components/start/start.component';
import {EmailComponent} from './components/login/email/email.component';
import {FormsModule} from '@angular/forms';
import {SignupComponent} from './components/login/signup/signup.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        StartComponent,
        EmailComponent,
        SignupComponent
    ],
    imports: [
        BrowserAnimationsModule,
        MdSidenavModule,
        MdListModule,
        MdToolbarModule,
        MdIconModule,
        MdProgressBarModule,
        MdButtonModule,
        MdCardModule,
        MdInputModule,
        BrowserModule,
        FormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        AppRoutingModule
    ],
    providers: [
        AuthGuard,
        AuthService,
        Configuration
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
