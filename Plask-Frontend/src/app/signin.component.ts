//Import Basic Modules
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { User } from './user';

import { UserService } from './user.service';

@Component({
    selector: 'signin',
    templateUrl: './signin.component.html',
    //styleUrls: [ './signin.component.css']
})
export class SignInComponent {

    constructor(
        private router: Router,
        private userService: UserService,
    ){ }

    user = new User;


    SignIn(){
       //Test Code to See if Sign In button funcitons correctly
       if ((this.user.email == 'swpp@snu.ac.kr') && (this.user.password == 'iluvswpp')){
           this.goToMain();
       }
       else{
           alert("Wrong Email or Passowrd!");
       }

      //Actual Code with Http Request (Commented for Now)
      // this.userService.signIn(this.user)
      //    .then(Status => {if(Status == 204){this.goToMain()} else{alert("Wrong Email or Password!")} });
    }

    goToMain(){
        this.router.navigate(['/main']);
    }

    goToSignUp(){
        this.router.navigate(['/signup']);
    }

 }