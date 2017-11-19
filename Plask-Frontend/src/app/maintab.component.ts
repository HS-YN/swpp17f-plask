//Import Basic Modules
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from './user';
import { Question } from './question';

import { UserService } from './user.service';
import { LocationService } from './location.service'; 

@Component({
    selector: 'maintab',
    templateUrl: './maintab.component.html',
    //styleUrls: [ './maintab.component.css']
})
export class MainTabComponent implements OnInit{

    constructor(
        private router: Router,
        private userService: UserService,
        private locationService: LocationService,
    ){ }

    ngOnInit(){

    }


}