//Import Basic Modules
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from './user';
import { Question } from './question';

import { UserService } from './user.service';
import { LocationService } from './location.service'; 
import { QuestionService } from './question.service'; 

@Component({
    selector: 'myanswers',
    templateUrl: './myanswers.component.html',
    //styleUrls: [ './maintab.component.css']
})
export class MyAnswersComponent implements OnInit{

    constructor(
        private router: Router,
        private userService: UserService,
        private locationService: LocationService,
        private questionService: QuestionService,
    ){ }


    ngOnInit(){
    }
}
