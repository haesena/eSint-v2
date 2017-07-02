import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {StartComponent} from '../components/pages/start/start.component';
import {LoginComponent} from '../components/login/login.component';
import {AuthGuard} from './auth-guard.service';
import {EmailComponent} from '../components/login/email/email.component';
import {SignupComponent} from '../components/login/signup/signup.component';
import {SettingsComponent} from '../components/pages/settings/settings.component';

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
    path: 'start',
    canActivate: [AuthGuard],
    component: StartComponent
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    component: SettingsComponent
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
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
export class AppRoutingModule { }
