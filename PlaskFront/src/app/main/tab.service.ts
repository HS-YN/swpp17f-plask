import { Injectable } from '@angular/core';
import { Headers, Http, XSRFStrategy  } from '@angular/http';
import { Question  } from '../question/question';
import { Answer } from '../answer/answer';
import { QuestionService } from '../question/question.service';
import { AnswerService } from '../answer/answer.service';
import 'rxjs/add/operator/toPromise';

type Qlist = [Question, boolean, Answer[]][];

 @Injectable()
 export class TabService(){
     constructor(
         private questionService: QuestionService,
         private answerService: AnswerService,
     ){}

     questionList:QList;
     temp_questionList:string[];

     /*
      * Get questions and answers
      * 1: getRecent 2: getMyQ 3: getMyA
     */
     getQuestionList(int kind):Qlist {
         this.questionList = [];
         this.questionService.getQuestion(kind).then(questions =>{
             this.temp_questionList = questions;
             return this.getAnswerList();
         });
     }
     getAnswerList(){
         for(let q of this.temp_questionList){
              var temp_answerList = [];
              this.answerService.getAnswer(q.id).then(answers =>{
                  if(answers != null)
                      temp_answerList = answers;
                  this.questionList.push([q, true, temp_answerList]);
              })
         }
     }
 }
