import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {StartComponent} from '../components/start/start.component';
import {LoginComponent} from '../components/login/login.component';
import {AuthGuard} from './auth-guard.service';
import {EmailComponent} from '../components/login/email/email.component';
import {SignupComponent} from '../components/login/signup/signup.component';

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
