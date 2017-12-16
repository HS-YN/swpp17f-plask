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
    selector: 'myanswers',
    templateUrl: './myanswers.component.html',
    styleUrls: [ '../myquestions/myquestions.component.css']
})
export class MyAnswersComponent implements OnInit{

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
    chooseAnswerEnable: boolean = false;

    socket: WebSocket;

    ngOnInit(){
        this.userService.getUser().then(User => {this.user = User});
        this.getQuestionList();

        // Create a websocket to send responses
        this.socket = new WebSocket("ws://localhost:8000/notification");
    }

    getQuestionList():void {
        this.questionList = [];
        this.questionService.getQuestion(3).then(questions =>{
            for(let q of questions){
                 this.questionList.push([q, true, []]);
            }
        })
    }

    getAnswer(qid:number, qindex:number){
        this.answerService.getAnswer(qid).then(answers => {
             this.questionList[qindex][2] = answers;
        });
    }

    expand(question):void {
        if(question[1]==true){
            let qindex:number;
            // hide all other questions that are expanded
            for (let i =0; i< this.questionList.length; ++i){
                if (this.questionList[i][1] == false){
                    this.questionList[i][1] =true;
                }
                //get where the question located in list
                if(this.questionList[i][0].id == question[0].id){
                    qindex=i;
                }
            }
            this.answer = ""; //clear answer tab            
            question[1] = false;
            this.chooseAnswerEnable = (question[0].author === this.user.username) && (question[0].select_id === -1);

            //get answers if it is not loaded
            if(question[2].length == 0){
                 question[2] = this.getAnswer(question[0].id, qindex);
            }
        }
        else{
            question[1] = true;
        }
    }

    // helper function to retrieve quesiton index from question id
    findQuestion(id): number {
        for (let i  = 0; i < this.questionList.length; ++i){
            if(this.questionList[i][0].id === id){
                return i;
            }
        }
    }

    answerClick(id):void{
        if(this.answer=="")
            alert("Please type answer!");
        else{
            this.answerService.postAnswer(this.answer, id).then(Status=>{
                if(Status != 204) {alert("Answer could not be sent, please try again");}
                else {

                    // send notification to the receiver
                    // only if the answer has not been chosen and the receiver is not the user him/herself
                    var qindex = this.findQuestion(id);
                    if ((this.questionList[qindex][0].select_id === -1) && (this.questionList[qindex][0].author != this.user.username)){
                
                        var msg = {
                            type: "message",
                            q_author: this.questionList[qindex][0].author,
                            text: this.answer,
                        }
                        this.socket.send(JSON.stringify(msg));
                    }

                    alert("Answer successfully posted!");

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
                this.chooseAnswerEnable = false;
            }
        });
    }
    
}
