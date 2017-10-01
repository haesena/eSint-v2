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
        canActivate: [AuthGuard],
        component: MyListComponent
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
