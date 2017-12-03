//Import Basic Modules
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
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
    temp_questionList:Question[] = [];

    // Observable
    timerSubscription: any;
    inactive: boolean = true;

    ngOnInit(){
        this.userService.getUser().then(User => {this.user = User});
        this.getQuestionList();
        this.timerSubscription = Observable.interval(30000).takeWhile(() => this.inactive).subscribe(() => this.getQuestionList());  

    }

    getQuestionList():void {
        this.questionService.getQuestion().then(questions =>{
            this.temp_questionList = questions;
            this.getAnswerList();
        });
    }
    getAnswerList():void{
        console.log(this.temp_questionList);
        this.questionList = [];
        for(let q of this.temp_questionList){
            var temp_answerList = [];
            this.answerService.getAnswer(q.id).then(answers =>{
                if(answers != null)
                    temp_answerList = answers;
                this.questionList.push([q, true, temp_answerList]);
                console.log(temp_answerList);
            })
        }
    };
    expand(question):void {
        if(question[1]==true){
            // hide all other questions that are expanded
            for (let i =0; i< this.questionList.length; ++i){
                if (this.questionList[i][1] == false){
                    this.questionList[i][1] =true;
                }
            }
            this.answer = ""; //clear answer tab
            question[1] = false;
            this.inactive = false;
        }
        else{
            question[1] = true;
            this.inactive = true;
            this.timerSubscription.unsubscribe();
            this.timerSubscription = Observable.interval(30000).takeWhile(() => this.inactive).subscribe(() => this.getQuestionList());
        }

    }
    answerClick(id):void{
        if(this.answer=="")
            alert("Please type answer!");
        else{
            this.answerService.postAnswer(this.answer, id).then(Status=>{
                if(Status != 204) {
                    alert("Answer could not be sent, please try again");
                }
                else {
                    alert("Answer successfully posted!");
                    //window.location.reload();
                    this.answer = "";
                    this.getQuestionList();
                }
            });
        }
    }
}
