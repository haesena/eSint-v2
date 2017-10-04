import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MdSidenavModule,
    MdListModule,
    MdToolbarModule,
    MdIconModule,
    MdProgressBarModule,
    MdCardModule,
    MdButtonModule,
    MdInputModule,
    MdDialogModule,
    MdMenuModule
} from '@angular/material';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { Configuration } from './configuration';

// Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

// Routing
import { AppRoutingModule } from './routing/app-routing.module';
import { AuthGuard } from './routing/auth-guard.service';
import { AuthService } from './services/authentication/auth.service';

// Login-Components
import { LoginComponent } from './components/login/login.component';
import { EmailComponent } from './components/login/email/email.component';
import { SignupComponent } from './components/login/signup/signup.component';

// Page-Components
import { StartComponent } from './components/pages/start/start.component';
import { SettingsComponent } from './components/pages/settings/settings.component';
import { NewGroupComponent } from './components/pages/new-group/new-group.component';
import { GroupFormComponent } from './components/forms/group-form/group-form.component';
import { EditGroupComponent } from './components/pages/edit-group/edit-group.component';
import { ManageGroupsComponent } from './components/pages/manage-groups/manage-groups.component';
import { MyListComponent } from './components/pages/my-list/my-list.component';

// Menu Components
import { GroupSelectComponent } from './components/partials/group-select/group-select.component';
import { ListSelectComponent } from './components/partials/list-select/list-select.component';

// Services
import { GroupsService } from './services/firebase/groups.service';
import { InvitesService } from './services/firebase/invites.service';
import { UserService } from './services/firebase/user.service';
import { InviteDialogComponent } from './components/partials/invite-dialog/invite-dialog.component';
import { InviteComponent } from './components/pages/invite/invite.component';
import { WishFormComponent } from './components/forms/wish-form/wish-form.component';
import {WishlistsService} from './services/firebase/wishlists.service';
import {ActiveGroupGuard} from './routing/active-group-guard.service';
import {InviteGuard} from './routing/invite-guard.service';
import { EditWishComponent } from './components/pages/edit-wish/edit-wish.component';

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
        ListSelectComponent,
        InviteDialogComponent,
        InviteComponent,
        WishFormComponent,
        EditWishComponent
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
        MdDialogModule,
        MdMenuModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        AppRoutingModule,
        FlexLayoutModule
    ],
    providers: [
        AuthGuard,
        ActiveGroupGuard,
        InviteGuard,
        AuthService,
        UserService,
        GroupsService,
        InvitesService,
        WishlistsService,
        Configuration
    ],
    entryComponents: [
        InviteDialogComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
