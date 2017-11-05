//Import Basic Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

//Import Components
import { AppComponent } from './app.component';
import { SignInComponent } from './signin.component';
import { SignUpComponent } from './signup.component';
import { MainComponent } from './main.component';
import { SettingsComponent } from './settings.component';

//Import Service
import { UserService } from './user.service';
import { LocationService } from './location.service';

import { AppRoutingModule } from './app-routing.module';

import { APP_BASE_HREF } from '@angular/common';

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
    ],
    providers: [
        UserService,
        LocationService,
        { provide: APP_BASE_HREF, useValue: '/' }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
