//Import Basic Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';

//Import Components
import { SignInComponent } from '../signin/signin.component';
import { MainComponent } from '../main/main.component';
import { SignUpComponent } from '../signup/signup.component';
import { SettingsComponent } from '../main/settings/settings.component';
import { BlankComponent } from '../miscellaneous/blank.component';
import { PageNotFoundComponent } from '../miscellaneous/pagenotfound.component';

import { AuthGuardService as AuthGuard } from '../authentication/auth-guard.service';
import { RedirectService as Redirect } from '../authentication/redirect.service';

//Routes between Components
const routes: Routes = [
    { path: '', redirectTo: '/signin', pathMatch: 'full'},
    { path: 'signin', component: SignInComponent, canActivate: [Redirect] },
    { path: 'signup', component: SignUpComponent, canActivate: [Redirect] },
    { path: 'main', component: MainComponent, canActivate: [AuthGuard]},
    { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
    { path: 'blank', component: BlankComponent },
    { path: '404', component: PageNotFoundComponent},
    { path: '**', redirectTo: '404'},

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
