//Import Basic Modules
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../user/user';

import { UserService } from '../user/user.service';

@Component({
    selector: 'signin',
    templateUrl: './signin.component.html',
    //styleUrls: [ './signin.component.css']
})
export class SignInComponent implements OnInit {

    constructor(
        private router: Router,
        private userService: UserService,
    ){ }

    user = new User;
    title: string = "Plask!";
    subtitle: string = "Location-based live Q&A platform"

    ngOnInit(){
        this.userService.getUser().then(user => {
            if(user != null)    this.router.navigate(['/main']);
        })
    }

    SignIn(){
        this.userService.signIn(this.user).then(Status => {
            if (Status == 204) { this.goToMain() }
        }).catch((err) => { alert("Signin failed. Please try again!")});
    }

    goToMain(){
        this.router.navigate(['/main']);
    }

    goToSignUp(){
        this.router.navigate(['/signup']);
    }

 } /* istanbul ignore next */
