import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StartComponent} from '../components/pages/start/start.component';
import {LoginComponent} from '../components/login/login.component';
import {AuthGuard} from './auth-guard.service';
import {EmailComponent} from '../components/login/email/email.component';
import {SignupComponent} from '../components/login/signup/signup.component';
import {SettingsComponent} from '../components/pages/settings/settings.component';
import {NewGroupComponent} from '../components/pages/new-group/new-group.component';
import {EditGroupComponent} from '../components/pages/edit-group/edit-group.component';
import {ManageGroupsComponent} from '../components/pages/manage-groups/manage-groups.component';
import {MyListComponent} from '../components/pages/my-list/my-list.component';
import {InviteComponent} from '../components/pages/invite/invite.component';
import {ActiveGroupGuard} from './active-group-guard.service';
import {InviteGuard} from './invite-guard.service';
import {EditWishComponent} from '../components/pages/edit-wish/edit-wish.component';
import {WishlistComponent} from '../components/pages/wishlist/wishlist.component';
import {MyGiftsComponent} from '../components/pages/my-gifts/my-gifts.component';

const appRoutes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'login-email',
        component: EmailComponent
    },
    {
        path: 'signup',
        component: SignupComponent
    },
    {
        path: 'invite/:inviteId',
        canActivate: [InviteGuard],
        component: InviteComponent
    },
    {
        path: 'start',
        canActivate: [AuthGuard],
        component: StartComponent
    },
    {
        path: 'new-group',
        canActivate: [AuthGuard],
        component: NewGroupComponent
    },
    {
        path: 'manage-groups',
        canActivate: [AuthGuard],
        component: ManageGroupsComponent
    },
    {
        path: 'edit-group/:gid',
        canActivate: [AuthGuard],
        component: EditGroupComponent
    },
    {
        path: 'settings',
        canActivate: [AuthGuard],
        component: SettingsComponent
    },
    {
        path: 'my-list',
        canActivate: [AuthGuard, ActiveGroupGuard],
        component: MyListComponent
    },
    {
        path: 'my-gifts',
        canActivate: [AuthGuard, ActiveGroupGuard],
        component: MyGiftsComponent
    },
    {
        path: 'edit-wish/:wid',
        canActivate: [AuthGuard, ActiveGroupGuard],
        component: EditWishComponent
    },
    {
        path: 'wishlist/:lid',
        canActivate: [AuthGuard, ActiveGroupGuard],
        component: WishlistComponent
    },
    {
        path: '',
        redirectTo: '/start',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/start'
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {
}
