//Import Basic Modules
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from './user';
import { Question } from './question';
import { Answer } from './answer';

import { UserService } from './user.service';
import { LocationService } from './location.service'; 
import { QuestionService } from './question.service'; 
import { AnswerService } from './answer.service';

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
        private answerService: AnswerService,
    ){ }

    user: User = new User();
    questionList: [Question, boolean,Answer[]][];
    answer:string = "";

    ngOnInit(){
        this.userService.getUser().then(User => {this.user = User});
        this.getQuestionList();
/*        var q1:Question = {id:0, content:"when does the CU in 301 closes?", author:"kongdaesaeng",
            locations:"Korea/Seoul/Gwanak", services:"convenient store"}; 
        var q2: Question = {id:1, content:"when does the CU in 302 opens?", author:"kongdaesaeng",
            locations:"Korea/Seoul/Gwanak", services:"convenient store"}; 
        var a1: Answer = {author:"resident", content:"there is no convenient store in 302"};
        this.questionList = [[q1,true,[]], [q2,true,[a1]]];*/
    }

    getQuestionList():void {
        this.questionService.getRecentQuestion().then(questions =>{
            this.questionList = null;
            var a:Answer[];
            for(let q of questions){
                this.answerService.getAnswer(q.id).then(answers =>{
                    a = answers;
                })
                this.questionList.push([q, true, a]);
            }
        })
    }
    expand(question):void {
        if(question[1]==true)
            question[1] = false;
        else
            question[1] = true;
    }
    answerClick(id):void{
        if(this.answer=="")
            alert("Please type answer!");
        else{
            this.answerService.postAnswer(this.answer, id).then(Status=>{
                if(Status != 204) {alert("Question could not be sent, please try again");}
            });
            alert("Answer successfully posted!");
            this.answer = "";
            this.getQuestionList();
        }
    }
}
