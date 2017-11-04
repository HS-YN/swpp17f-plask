//Import Basic Modules
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from './user';

import { UserService } from './user.service';

@Component({
    selector: 'signup',
    templateUrl: './signup.component.html',
    //styleUrls: [ './signup.component.css']
})
export class SignUpComponent implements OnInit {

    constructor(
        private router: Router,
        private userService: UserService,
    ){ }

    user = new User();
    passwordConfirmation = '';

    LocationsList: string[];

    ngOnInit(): void{

    }

    //Create a new User Account 
    SignUp(): void {
        if(this.ValidatePassword()){
            this.userService.signUp(this.user)
                .then(Status => {if(Status == 201){this.goToMain()} else{alert("Invalid User Info!")} });
            //Q. Does the Frontend know which of the field is invalid?

        }
        else{
            alert ("Password is Different!")
        }
    }

    //Validate Password Match
    ValidatePassword(): boolean {
        if (this.user.password == this.passwordConfirmation){
            return true;
        }
        else{
            return false;
        }
    }

    goToMain(){
        this.router.navigate(['/main']);
    }

    goBack(){
        this.router.navigate(['/signin']);
    }

}
