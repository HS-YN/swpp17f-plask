//Import Basic Modules
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from './user';

import { UserService } from './user.service';


@Component({
    selector: 'main',
    templateUrl: './main.component.html',
    //styleUrls: [ './main.component.css']
})
export class MainComponent implements OnInit{

    constructor(
        private router: Router,
        private userService: UserService,
    ){ }

    ngOnInit(): void{
        this.userService.getUser().then(user => {
            if(user == null)    this.router.navigate(['/signin']);
        })
    }

    goToSettings(): void{
         this.router.navigate(['/settings']);
    }

    goSignOut(): void{
        this.userService.signOut().then(() => this.router.navigate(['/signin']));
    }

}/* istanbul ignore next */
