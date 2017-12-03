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
    }

    getSearchQuestionList(searchString: string, locCode: string[]):void {
        //this.ngZone.run(()=>{
            this.questionList = [];
            this.questionService.getSearchedQuestion(searchString, locCode).then(questions => {
                this.temp_questionList = questions;
                this.getAnswerList();
                //alert("Search Complete!")
            });
        //});
    }

    getAnswerList():void{
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
        }
        // collapse if opened
        else{
            question[1] = true;
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
                    window.location.reload();
                    this.answer = "";
                    //this.getSearchQuestionList();
                }
            });
        }
    }
}
