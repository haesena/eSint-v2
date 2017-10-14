import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatProgressBarModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatMenuModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule
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
import { ActiveGroupGuard } from './routing/active-group-guard.service';
import { InviteGuard } from './routing/invite-guard.service';
import { AuthService } from './services/authentication/auth.service';

// Login-Components
import { LoginComponent } from './components/login/login.component';
import { EmailComponent } from './components/login/email/email.component';
import { SignupComponent } from './components/login/signup/signup.component';

// Page Components
import { StartComponent } from './components/pages/start/start.component';
import { SettingsComponent } from './components/pages/settings/settings.component';
import { EditGroupComponent } from './components/pages/edit-group/edit-group.component';
import { ManageGroupsComponent } from './components/pages/manage-groups/manage-groups.component';
import { MyListComponent } from './components/pages/my-list/my-list.component';
import { InviteComponent } from './components/pages/invite/invite.component';
import { EditWishComponent } from './components/pages/edit-wish/edit-wish.component';
import { WishlistComponent } from './components/pages/wishlist/wishlist.component';
import { MyGiftsComponent } from './components/pages/my-gifts/my-gifts.component';
import { EditGiftComponent } from './components/pages/edit-gift/edit-gift.component';
import { NotificationsComponent } from './components/pages/notifications/notifications.component';

// Display Components
import { GroupDisplayComponent } from './components/forms/group-display/group-display.component';
import { GroupFormComponent } from './components/forms/group-form/group-form.component';
import { WishDisplayComponent } from './components/forms/wish-display/wish-display.component';
import { WishFormComponent } from './components/forms/wish-form/wish-form.component';
import { GiftDisplayComponent } from './components/forms/gift-display/gift-display.component';
import { GiftFormComponent } from './components/forms/gift-form/gift-form.component';
import { NotificationDisplayComponent } from './components/forms/notification-display/notification-display.component';

// Dialog Components
import { InviteDialogComponent } from './components/partials/invite-dialog/invite-dialog.component';
import { ConfirmDialogComponent } from './components/partials/confirm-dialog/confirm-dialog.component';

// Menu Components
import { GroupSelectComponent } from './components/partials/group-select/group-select.component';
import { ListSelectComponent } from './components/partials/list-select/list-select.component';

// Services
import { GroupsService } from './services/firebase/groups.service';
import { InvitesService } from './services/firebase/invites.service';
import { UserService } from './services/firebase/user.service';
import { WishlistsService } from './services/firebase/wishlists.service';
import { GiftsService } from './services/firebase/gifts.service';
import { NotificationsService } from './services/firebase/notifications.service';


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        StartComponent,
        EmailComponent,
        SignupComponent,
        SettingsComponent,
        GroupFormComponent,
        EditGroupComponent,
        GroupSelectComponent,
        ManageGroupsComponent,
        MyListComponent,
        ListSelectComponent,
        InviteDialogComponent,
        InviteComponent,
        WishFormComponent,
        EditWishComponent,
        WishDisplayComponent,
        WishlistComponent,
        MyGiftsComponent,
        GiftDisplayComponent,
        EditGiftComponent,
        GiftFormComponent,
        GroupDisplayComponent,
        ConfirmDialogComponent,
        NotificationsComponent,
        NotificationDisplayComponent
    ],
    imports: [
        BrowserAnimationsModule,
        MatSidenavModule,
        MatListModule,
        MatToolbarModule,
        MatIconModule,
        MatProgressBarModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        BrowserModule,
        FormsModule,
        MatDialogModule,
        MatMenuModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatProgressSpinnerModule,
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
        GiftsService,
        NotificationsService,
        Configuration
    ],
    entryComponents: [
        InviteDialogComponent,
        ConfirmDialogComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
