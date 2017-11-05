//Import Basic Modules
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from './user';

import { UserService } from './user.service';

@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    //styleUrls: [ './settings.component.css']
})
export class SettingsComponent implements OnInit{

    constructor(
        private router: Router,
        private userService: UserService,
    ){ }

    ngOnInit(): void{
        this.userService.getUser().then(user => {
            if(user == null)    this.router.navigate(['/signin']);
        })
    }


} /* istanbul ignore next */
