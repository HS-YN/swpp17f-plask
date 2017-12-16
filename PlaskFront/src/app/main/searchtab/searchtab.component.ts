//Import Basic Modules
import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { User } from '../../user/user';
import { Question } from '../../question/question';
import { Answer } from '../../answer/answer';

import { UserService } from '../../user/user.service';
import { LocationService } from '../../location/location.service';
import { QuestionService } from '../../question/question.service';
import { AnswerService } from '../../answer/answer.service';

import 'rxjs/add/operator/switchMap';

@Component({
    selector: 'searchtab',
    templateUrl: './searchtab.component.html',
    styleUrls: [ '../maintab/maintab.component.css']
})
export class SearchTabComponent implements OnInit{

    constructor(
        private route: ActivatedRoute,
        private userService: UserService,
        private locationService: LocationService,
        private questionService: QuestionService,
        private answerService: AnswerService,
    ){ }

    user: User = new User();
    questionList: [Question, boolean,Answer[]][] = [];
    answer:string = "";
    temp_questionList:Question[] = [];
    searchString:string = "";
    locCode:string[] = [];
    chooseAnswerEnable: boolean = false;

    socket: WebSocket;

    ngOnInit(){
        console.log("here");
        this.route.params.subscribe(params=>{
            this.searchString = params['str'];
            this.locCode = [params['id1'], params['id2'], params['id3']];
        });

        this.questionService.getSearchedQuestion(this.searchString, this.locCode).then(
            questionList => {
                this.temp_questionList = questionList;
                this.getAnswerList();
            })
        console.log(this.temp_questionList);
        this.userService.getUser().then(User => {this.user = User});

        // Create a websocket to send responses
        this.socket = new WebSocket("ws://localhost:8000/notification");

    }

    getSearchQuestionList(searchString: string, locCode: string[]):void {
            this.questionList = [];
            this.questionService.getSearchedQuestion(searchString, locCode).then(questions => {
                this.temp_questionList = questions;
                this.getAnswerList();
            });
    }

    getAnswerList():void{
        if(this.temp_questionList.length === 0){
            alert("No question matched!");
            return;
        }
        alert("Search Complete!");
        for(let q of this.temp_questionList){
            var temp_answerList = [];
            this.answerService.getAnswer(q.id).then(answers =>{
                if(answers != null)
                    temp_answerList = answers;
                    this.questionList.push([q, true, temp_answerList]);
                    console.log(this.questionList)});
        }
    };

    expand(question):void {
        // expand if hidden
        if(question[1]==true){

            // hide all other questions that are expanded
            for (let i =0; i< this.questionList.length; ++i){
                if (this.questionList[i][1] == false){
                    this.questionList[i][1] =true;
                }
            }
            this.answer = ""; //clear answer tab
            question[1] = false;
            this.chooseAnswerEnable = (question[0].author === this.user.username) && (question[0].select_id === -1);
        }
        // collapse if opened
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
                if(Status != 204) {
                    alert("Question could not be sent, please try again");
                }
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
                    this.getSearchQuestionList(this.searchString, this.locCode);
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
