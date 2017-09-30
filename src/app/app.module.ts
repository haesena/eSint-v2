import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

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
import {StartComponent} from './components/pages/start/start.component';
import {EmailComponent} from './components/login/email/email.component';
import {FormsModule} from '@angular/forms';
import {SignupComponent} from './components/login/signup/signup.component';
import {UserService} from './services/firebase/user.service';
import { SettingsComponent } from './components/pages/settings/settings.component';
import {GroupsService} from './services/firebase/groups.service';
import { NewGroupComponent } from './components/pages/new-group/new-group.component';
import { GroupFormComponent } from './components/forms/group-form/group-form.component';
import { EditGroupComponent } from './components/pages/edit-group/edit-group.component';
import { GroupSelectComponent } from './components/partials/group-select/group-select.component';
import { ManageGroupsComponent } from './components/pages/manage-groups/manage-groups.component';
import { MyListComponent } from './components/pages/my-list/my-list.component';
import { ListSelectComponent } from './components/partials/list-select/list-select.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        StartComponent,
        EmailComponent,
        SignupComponent,
        SettingsComponent,
        NewGroupComponent,
        GroupFormComponent,
        EditGroupComponent,
        GroupSelectComponent,
        ManageGroupsComponent,
        MyListComponent,
        ListSelectComponent
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
        AppRoutingModule,
        FlexLayoutModule
    ],
    providers: [
        AuthGuard,
        AuthService,
        UserService,
        GroupsService,
        Configuration
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
