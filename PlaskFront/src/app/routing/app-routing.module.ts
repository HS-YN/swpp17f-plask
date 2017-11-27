//Import Basic Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Import Components
import { SignInComponent } from '../signin/signin.component';
import { MainComponent } from '../main/main.component';
import { SignUpComponent } from '../signup/signup.component';
import { SettingsComponent } from '../main/settings/settings.component';
import { MainTabComponent } from '../main/maintab/maintab.component';
import { MyQuestionsComponent } from '../main/myquestions/myquestions.component';
import { MyAnswersComponent } from '../main/myanswers/myanswers.component';

//Routes between Components
const routes: Routes = [
    { path: '', redirectTo: '/signin', pathMatch: 'full'},
    { path: 'signin', component: SignInComponent },
    { path: 'signup', component: SignUpComponent },
    { path: 'main', component: MainComponent, children: [
            { path: 'maintab', component: MainTabComponent, outlet:'tab'},
            { path: 'myquestions', component: MyQuestionsComponent, outlet:'tab'},
            { path: 'myanswers', component: MyAnswersComponent, outlet:'tab'},
            { path: '', redirectTo: '/main/(tab:maintab)', pathMatch: 'full'},
        ]
    },
    { path: 'settings', component: SettingsComponent },


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
