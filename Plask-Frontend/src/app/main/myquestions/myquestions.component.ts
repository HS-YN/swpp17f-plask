//Import Basic Modules
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../user/user';
import { Question } from '../../question/question';
import { Answer } from '../../answer/answer';

import { UserService } from '../../user/user.service';
import { LocationService } from '../../location/location.service'; 
import { QuestionService } from '../../question/question.service'; 
import { AnswerService } from '../../answer/answer.service';

@Component({
    selector: 'myquestions',
    templateUrl: './myquestions.component.html',
    styleUrls: [ '../maintab/maintab.component.css'],
})
export class MyQuestionsComponent implements OnInit{

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
    }
    getQuestionList():void {
        this.questionService.getQuestion().then(questions =>{
            this.questionList = [];
            var a:Answer[];
            for(let q of questions){
                this.answerService.getAnswer(q.id).then(answers =>{
                    if(answers != null)
                        a = answers;
                })
                this.questionList.push([q, true, a]);
            }
        })
    };
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
                if(Status != 204) {alert("Answer could not be sent, please try again");}

            });
            alert("Answer successfully posted!");
            this.answer = "";
            this.getQuestionList();
        }
    }
}
