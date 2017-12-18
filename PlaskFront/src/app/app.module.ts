//Import Basic Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { XSRFStrategy, CookieXSRFStrategy } from '@angular/http';

//Import Components
import { AppComponent } from './app.component';
import { SignInComponent } from './signin/signin.component';
import { SignUpComponent } from './signup/signup.component';
import { MainComponent } from './main/main.component';
import { SettingsComponent } from './main/settings/settings.component';

//Import Service
import { UserService } from './user/user.service';
import { LocationService } from './location/location.service';
import { QuestionService } from './question/question.service';
import { AnswerService } from './answer/answer.service';
import { AuthService } from './authentication/auth.service';
import { AuthGuardService } from './authentication/auth-guard.service';
import { RedirectService } from './authentication/redirect.service';
 //If performance is significantly degraded, this can be removed.
import { TagService } from './main/tag.service';

import { AppRoutingModule } from './routing/app-routing.module';

import { APP_BASE_HREF } from '@angular/common';

// AutoComplete Module
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';

@NgModule({
    declarations: [
        AppComponent,
        SignInComponent,
        SignUpComponent,
        MainComponent,
        SettingsComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        Ng2AutoCompleteModule, // Added for AutoComplete
    ],
    providers: [
        UserService,
        LocationService,
        QuestionService,
        AnswerService,
        AuthService,
        AuthGuardService,
        RedirectService,
        TagService,
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: XSRFStrategy, useFactory: cookieStrategy},
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

export function cookieStrategy(){
    return new CookieXSRFStrategy('csrftoken', 'X-CSRFToken');
    //return new CookieXSRFStrategy('_csrf', 'XSRF-TOKEN');
}
