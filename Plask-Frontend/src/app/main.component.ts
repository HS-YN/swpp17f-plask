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

    }

    goToSettings(): void{
         this.router.navigate(['/settings']);
    }
    
}