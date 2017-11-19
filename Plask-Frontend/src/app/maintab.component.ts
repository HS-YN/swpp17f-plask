//Import Basic Modules
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from './user';
import { Question } from './question';

import { UserService } from './user.service';
import { LocationService } from './location.service'; 
import { QuestionService } from './question.service'; 

@Component({
    selector: 'maintab',
    templateUrl: './maintab.component.html',
    styleUrls: [ './maintab.component.css']
})
export class MainTabComponent implements OnInit{

    constructor(
        private router: Router,
        private userService: UserService,
        private locationService: LocationService,
        private questionService: QuestionService,
    ){ }

    user: User = new User();
    questionList: [Question, boolean][];

    ngOnInit(){
        this.userService.getUser().then(User => {this.user = User});
        //this.getQuestionList();
        var q1:Question = {content:"when does the CU in 301 closes?", author:"kongdaesaeng",
            locations:"Korea/Seoul/Gwanak", services:"convenient store"}; 
        var q2: Question = {content:"when does the CU in 302 opens?", author:"kongdaesaeng",
            locations:"Korea/Seoul/Gwanak", services:"convenient store"}; 
        this.questionList = [[q1,true], [q2,true]];
    }

    getQuestionList():void {
        this.questionService.getRecentQuestion().then(questions =>{
            this.questionList = null;
            for(let q of questions){
                this.questionList.push([q, true]);
            }
        })
    }
    expand(question):void {
        if(question[1]==true)
            question[1] = false;
        else
            question[1] = true;
    }
}
