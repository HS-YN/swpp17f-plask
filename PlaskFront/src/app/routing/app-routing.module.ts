//Import Basic Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';

//Import Components
import { SignInComponent } from '../signin/signin.component';
import { MainComponent } from '../main/main.component';
import { SignUpComponent } from '../signup/signup.component';
import { SettingsComponent } from '../main/settings/settings.component';

import { AuthGuardService as AuthGuard } from '../authentication/auth-guard.service';
import { RedirectService as Redirect } from '../authentication/redirect.service';

//Routes between Components
const routes: Routes = [
    { path: '', redirectTo: '/signin', pathMatch: 'full'},
    { path: 'signin', component: SignInComponent, canActivate: [Redirect] },
    { path: 'signup', component: SignUpComponent, canActivate: [Redirect] },
    { path: 'main', component: MainComponent, canActivate: [AuthGuard]},
    { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },


];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],

    exports: [
        RouterModule
    ]

})
export class AppRoutingModule {}
