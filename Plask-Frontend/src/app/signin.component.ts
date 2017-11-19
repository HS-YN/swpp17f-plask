//Import Basic Modules
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from './user';

import { UserService } from './user.service';

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

    test: number = 0;

    ngOnInit(){
        this.userService.getUser().then(user => {
            if(user != null)    this.router.navigate(['/main']);
        })
    }

    SignIn(){
        /* Test Code to See if Sign In button funcitons correctly
        if ((this.user.email == 'swpp@snu.ac.kr') && (this.user.password == 'iluvswpp')){
            this.goToMain();
        }
        else{
            alert("Wrong Email or Passowrd!");
        }
        */
        this.userService.signIn(this.user).then(Status => {
            this.test = 1;
            console.log ("STATUS CODE:", Status);
            if (Status != 204) { alert ("Wrong Email or Password!") }
            else{ this.goToMain() }
        });
    }

    goToMain(){
        this.router.navigate(['/main']);
    }

    goToSignUp(){
        this.router.navigate(['/signup']);
    }

 } /* istanbul ignore next */
