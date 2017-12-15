//Import Basic Modules
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
//import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { User } from '../../user/user';
import { Question } from '../../question/question';
import { Answer } from '../../answer/answer';

import { UserService } from '../../user/user.service';
import { LocationService } from '../../location/location.service';
import { QuestionService } from '../../question/question.service';
import { AnswerService } from '../../answer/answer.service';

@Component({
    selector: 'maintab',
    templateUrl: './maintab.component.html',
    styleUrls: [ '../myquestions/myquestions.component.css']
})
export class MainTabComponent implements OnInit{

    constructor(
        private router: Router,
        private userService: UserService,
        private locationService: LocationService,
        private questionService: QuestionService,
        private answerService: AnswerService,
    )
    { }

    user: User = new User();
    questionList: [Question, boolean,Answer[]][];
    answer:string = "";
    temp_questionList:Question[] = [];

    // Observable
//    timerSubscription: any;
//    inactive: boolean = true;

    ngOnInit(){
        this.userService.getUser().then(User => {this.user = User});
        this.getQuestionList();
//        this.timerSubscription = Observable.interval(30000).takeWhile(() => this.inactive).subscribe(() => this.getQuestionList());  
    }

    getQuestionList():void {
        this.questionList = [];
        this.questionService.getQuestion(1).then(questions =>{
            for(let q of questions){
                this.questionList.push([q, true, []]);
            }
        });
    }
    getAnswer(qid:number, qindex:number){
        this.answerService.getAnswer(qid).then(answers => {
            this.questionList[qindex][2] = answers;
        });
    }

    expand(question):void {
        // expand if hidden
        if(question[1]==true){
            let qindex:number;
            // hide all other questions that are expanded
            for (let i =0; i< this.questionList.length; ++i){
                if (this.questionList[i][1] == false){
                    this.questionList[i][1] =true;
                } if(this.questionList[i][0].id == question[0].id){
                    qindex=i;
                } //get where the question located in list
            }
            this.answer = ""; //clear answer tab
            question[1] = false;

            //get answers if it is not loaded
            if(question[2].length == 0){ 
                question[2] = this.getAnswer(question[0].id, qindex);
            }
//            this.inactive = false;
        }
        // collapse if opened
        else{
            question[1] = true;
//            this.inactive = true;
//            this.timerSubscription.unsubscribe();
//            this.timerSubscription = Observable.interval(30000).takeWhile(() => this.inactive).subscribe(() => this.getQuestionList());
        }
    }

    answerClick(id):void{
        if(this.answer=="")
            alert("Please type answer!");
        else{
            this.answerService.postAnswer(this.answer, id).then(Status=>{
                if(Status != 204) {
                    alert("Question could not be sent, please try again");
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

    
    chooseAnswer(qid, aid): void{
        this.questionService.selectAnswer(qid, aid).then(Status=>{
            if(Status != 204){
                alert("Choice could not be sent, please try again");
            } else {
                alert("Answer successfully selected!");
                this.questionList[qid][0].select_id = aid;
            }
        });
    }


    // Unsubscribe all subscriptions in ngOnDestroy
    /*public ngOnDestroy(): void {
        if (this.timerSubscription){
            this.timerSubscription.unsubcribe();
        }
    }*/  

}
